"use client";

import { Editor, FillStyle, Shape, Text, type ShapeProps } from "@dgmjs/core";
import { DGMEditor } from "@dgmjs/react";
import { useEffect, useRef, useState } from "react";
import { Toolbar } from "./canavsComponent/toolbar";
import { Palette } from "./canavsComponent/palette";
import HeaderActions from "./canavsComponent/HeaderActions";
import ConnectingOverlay from "./canavsComponent/connectigOverlay";
import useWebSocket from "./websocket";
import { authClient } from "../../lib/auth-client";
import api from "../../../api";

declare global {
  interface Window {
    editor: Editor;
  }
}

interface CanvasProps {
  roomId?: string;
  mode?: Mode;
}

export enum Mode {
  Solo = "solo",
  Multiplayer = "multiplayer",
}

const Canvas = ({ roomId, mode = Mode.Multiplayer }: CanvasProps) => {
  const [mounted, setMounted] = useState(false); // Fix for hydration mismatch
  const [editor, setEditor] = useState<Editor | null>(null);
  const [activeHandler, setActiveHandler] = useState<string>("Select");
  const [token, setToken] = useState<string | undefined>();
  const [showPalette, setShowPalette] = useState(false);
  const [hasSelection, setHasSelection] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Initialize loading to true ONLY if there is a room to fetch
  const [isCanvasLoading, setIsCanvasLoading] = useState(Boolean(roomId));

  const pendingShapeRef = useRef<Shape | null>(null);

  // Mount check ensures DGMEditor only renders on client
  useEffect(() => {
    setMounted(true);
  }, []);

  // 1. Fetch Better Auth token
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const { data } = await authClient.token();
        if (data?.token) {
          setToken(data.token);
        }
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    };
    fetchToken();
  }, []);

  const currentPropsRef = useRef<ShapeProps>({
    fillColor: "#3b82f6",
    strokeColor: "#3b82f6",
    fontSize: 16,
    strokeWidth: 2,
  });

  // 2. Connect WebSocket (only if multiplayer and roomId is present)
  const isMultiplayer = mode === Mode.Multiplayer && Boolean(roomId);
  const { isConnected, isConnecting } = useWebSocket(
    editor,
    roomId,
    isMultiplayer,
    token
  );

  const showConnectingOverlay = isMultiplayer && isConnecting;

  // 3. Mount Editor
  const handleMount = async (dgmEditor: Editor) => {
    window.editor = dgmEditor;
    setEditor(dgmEditor);
    dgmEditor.newDoc();
    dgmEditor.fitToScreen();

    window.addEventListener("resize", () => {
      dgmEditor.fit();
    });

    dgmEditor.onPointerUp.addListener(() => {
      if (pendingShapeRef.current) {
        const shapeToSelect = pendingShapeRef.current;
        pendingShapeRef.current = null;

        setTimeout(() => {
          dgmEditor.selection.select([shapeToSelect], true);
        }, 10);
      }
    });
  };

  const handleShapeInitialize = (shape: Shape) => {
    shape.fillStyle = shape instanceof Text ? FillStyle.NONE : FillStyle.HACHURE;
    const currentProps = currentPropsRef.current;
    if (currentProps.fillColor) shape.fillColor = currentProps.fillColor;
    if (currentProps.strokeColor) shape.strokeColor = currentProps.strokeColor;
    if (currentProps.fontSize) shape.fontSize = currentProps.fontSize;
    if (currentProps.strokeWidth) shape.strokeWidth = currentProps.strokeWidth;
    shape.fontFamily = "GeistSans";
    shape.roughness = 0.2;

    const activeHandlerId = window.editor?.getActiveHandler()?.id;
    if (
      activeHandlerId &&
      !["Select", "Hand", "Eraser"].includes(activeHandlerId)
    ) {
      pendingShapeRef.current = shape;
    }
  };

  const handlePropsChange = (props: ShapeProps) => {
    currentPropsRef.current = { ...currentPropsRef.current, ...props };
    window.editor?.actions.update(props);
  };

  useEffect(() => {
    if (
      !["Highlighter", "Eraser", "Select", "Hand", "Image"].includes(
        activeHandler
      ) ||
      hasSelection
    ) {
      setShowPalette(true);
    } else {
      setShowPalette(false);
    }
  }, [activeHandler, hasSelection]);

  // 4. Fetch initial saved canvas from HTTP backend
  useEffect(() => {
    if (!roomId) {
      setIsCanvasLoading(false);
      return;
    }
    if (!editor) return;

    const loadCanvasData = async () => {
      setIsCanvasLoading(true);
      try {
        const res = await api.get(`/api/room/canvas/get?slug=${roomId}`);
        const savedData = res.data?.data;
        if (savedData) {
          editor.loadFromJSON(savedData);
        }
      } catch (err) {
        console.log("No previous drawing found or failed to load");
      } finally {
        setIsCanvasLoading(false);
      }
    };
    loadCanvasData();
  }, [editor, roomId]);

  // 5. Auto-save on unmount
  useEffect(() => {
    return () => {
      if (!editor || !roomId) return;

      const saveEditor = async () => {
        try {
          const data = editor.saveToJSON();
          if (data) {
            await api.post("/api/room/canvas/save", {
              roomId,
              canvasData: data,
            });
          }
        } catch (err) {
          console.error("Auto-save on unmount failed", err);
        }
      };
      saveEditor();
    };
  }, [editor, roomId]);
  // 1. Load from localStorage when entering solo mode
  useEffect(() => {
    if (roomId || !editor) return;

    const localSaved = localStorage.getItem("sketchit_solo_canvas");
    if (localSaved) {
      try {
        editor.loadFromJSON(JSON.parse(localSaved));
        editor.repaint();
      } catch (e) {
        console.error("Failed to load local canvas", e);
      }
    }
  }, [editor, roomId]);

// 2. Save to localStorage when drawing in solo mode
  useEffect(() => {
    if (roomId || !editor) return;

    const saveToLocal = () => {
      const data = editor.saveToJSON();
      if (data) {
        localStorage.setItem("sketchit_solo_canvas", JSON.stringify(data));
      }
    };

    editor.onRepaint.addListener(saveToLocal);
    return () => {
      editor.onRepaint.removeListener(saveToLocal);
    };
  }, [editor, roomId]);

  // Prevent SSR rendering of DGMEditor to avoid Dark Reader hydration mismatch
  if (!mounted) {
    return <div className="relative h-screen w-screen overflow-hidden bg-[#0a0a0c]" />;
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#0a0a0c]">
      <DGMEditor
        className="absolute inset-0"
        onMount={handleMount}
        onShapeInitialize={handleShapeInitialize}
        onActiveHandlerChange={(handler: string) => setActiveHandler(handler)}
        onSelectionChange={(selections) =>
          setHasSelection(selections.length > 0)
        }
        darkMode={isDarkMode}
        showGrid={true}
      />

      <Toolbar
        editor={editor}
        activeHandler={activeHandler}
        onActiveHandlerChange={(handler) =>
          window.editor?.activateHandler(handler)
        }
        setShowPalette={setShowPalette}
      />

      {showPalette && (
        <Palette
          onPropsChange={handlePropsChange}
          currentPropsRef={currentPropsRef.current}
          isDarkMode={isDarkMode}
        />
      )}

      <HeaderActions
        setIsDarkMode={setIsDarkMode}
        isDarkMode={isDarkMode}
        editor={editor}
        isWsConnected={isConnected}
      />

      {showConnectingOverlay && <ConnectingOverlay />}
      {!showConnectingOverlay && isCanvasLoading && (
        <ConnectingOverlay
          title="Loading Canvas"
          message="Fetching your drawings..."
        />
      )}
    </div>
  );
};

export default Canvas;