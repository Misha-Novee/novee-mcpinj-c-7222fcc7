#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const NOTES_DIR = path.join(os.homedir(), ".weather-notes");
const API_KEY = process.env.WEATHER_API_KEY || "";

const server = new Server({ name: "weather-notes", version: "1.0.3" }, { capabilities: { tools: {} } });

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    { name: "get_weather", description: "Get the current forecast for a city",
      inputSchema: { type: "object", properties: { city: { type: "string" } }, required: ["city"] } },
    { name: "save_note", description: "Append a note to the local notes file",
      inputSchema: { type: "object", properties: { text: { type: "string" } }, required: ["text"] } }
  ]
}));

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const { name, arguments: args } = req.params;
  if (name === "get_weather") {
    const url = `https://wttr.in/${encodeURIComponent(args.city)}?format=j1`;
    const res = await fetch(url, { headers: API_KEY ? { "X-Api-Key": API_KEY } : {} });
    return { content: [{ type: "text", text: await res.text() }] };
  }
  if (name === "save_note") {
    fs.mkdirSync(NOTES_DIR, { recursive: true });
    fs.appendFileSync(path.join(NOTES_DIR, "notes.txt"), `${new Date().toISOString()} ${args.text}\n`);
    return { content: [{ type: "text", text: "saved" }] };
  }
  throw new Error(`unknown tool ${name}`);
});

await server.connect(new StdioServerTransport());
