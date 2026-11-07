

import { useEffect, useRef, useState } from "react";
import { Editor } from "@dgmjs/core";
import toast from "react-hot-toast";

const useWebSocket = (
  editor: Editor | null,
  roomId?: string,
  enabled: boolean = true,
  token?: string
) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const lastMessageRef = useRef<string | null>(null);
  const isApplyingRemoteChangesRef = useRef(false);
  const throttleTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // 1. Guard check: only run if editor, roomId, enabled, and token exist
    if (!editor || !roomId || !enabled || !token) {
      setIsConnected(false);
      setIsConnecting(false);
      return;
    }

    const webSocketUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080";
    const ws = new WebSocket(`${webSocketUrl}?token=${token}`);
    setIsConnecting(true);

    ws.onopen = () => {
      console.log("WebSocket connected. Authenticating...");
    };

    // 2. Incoming messages from other users / server
    ws.onmessage = async (event) => {
      let rawData: string;
      if (event.data instanceof Blob) {
        rawData = await event.data.text();
      } else {
        rawData = typeof event.data === "string" ? event.data : event.data.toString();
      }

      let data: any;
      try {
        data = JSON.parse(rawData);
      } catch (err) {
        console.error("Failed to parse WebSocket message:", err);
        return;
      }

      // Handshake ready: join the room
      if (data.type === "connection:ready") {
        setIsConnected(true);
        // Note: your ws-backend expects "join_room"
        ws.send(JSON.stringify({ type: "join_room", roomId, payloadData: true }));

        const fullData = editor.saveToJSON();
        if (fullData) {
          let hasShapes = false;
          if (fullData.children) {
            const page = fullData.children.find((child: any) => child.type === "Page");
            if (page) {
              delete page.pageOrigin;
              if (page.children && page.children.length > 0) {
                hasShapes = true;
              }
            }
          }

          lastMessageRef.current = JSON.stringify(fullData);

          if (hasShapes) {
            ws.send(
              JSON.stringify({
                type: "page-sync",
                roomId,
                payloadData: fullData,
              })
            );
          }
        }
      }

      // Room joined confirmation
      if (data.type === "roomJoined") {
        setIsConnecting(false);
        if (data.payloadData === true || data.pageData === true) {
          toast.success("Joined room successfully", {
            position: "bottom-right",
          });
        }
      }

      // Incoming drawing updates from peers
      if (data.type === "page-sync" || data.type === "page:sync") {
        const incomingData = data.payloadData || data.pageData;
        if (!incomingData) return;

        isApplyingRemoteChangesRef.current = true;

        // Keep local user's camera position and zoom level intact
        const localPage = editor.getCurrentPage();
        if (localPage && incomingData.children) {
          const remotePage = incomingData.children.find(
            (child: any) => child.type === "Page"
          );
          if (remotePage) {
            remotePage.pageOrigin = localPage.pageOrigin;
            remotePage.pageScale = localPage.pageScale;
          }
        }

        editor.loadFromJSON(incomingData);

        const updatedData = editor.saveToJSON();
        if (updatedData && updatedData.children) {
          const page = updatedData.children.find(
            (child: any) => child.type === "Page"
          );
          if (page) delete page.pageOrigin;
          lastMessageRef.current = JSON.stringify(updatedData);
        }

        setTimeout(() => {
          isApplyingRemoteChangesRef.current = false;
        }, 50);
      }
    };

    // 3. Local drawing listener (throttled to 100ms)
    const handleRepaint = () => {
      if (isApplyingRemoteChangesRef.current) return;
      if (throttleTimeoutRef.current) return;

      throttleTimeoutRef.current = setTimeout(() => {
        throttleTimeoutRef.current = null;

        if (ws.readyState === WebSocket.OPEN) {
          const fullDocData = editor.saveToJSON();
          if (!fullDocData) return;

          if (fullDocData.children) {
            const page = fullDocData.children.find(
              (c: any) => c.type === "Page"
            );
            if (page) {
              delete page.pageOrigin;
            }
          }

          const newJsonString = JSON.stringify(fullDocData);

          if (newJsonString !== lastMessageRef.current) {
            lastMessageRef.current = newJsonString;
            ws.send(
              JSON.stringify({
                type: "page-sync",
                roomId,
                payloadData: fullDocData,
              })
            );
          }
        }
      }, 100);
    };

    editor.onRepaint.addListener(handleRepaint);

    // 4. Cleanup when leaving the room
    return () => {
      setIsConnected(false);
      setIsConnecting(false);
      editor.onRepaint.removeListener(handleRepaint);
      if (throttleTimeoutRef.current) clearTimeout(throttleTimeoutRef.current);
      ws.close();
    };
  }, [editor, roomId, enabled, token]);

  return { isConnected, isConnecting };
};

export default useWebSocket;