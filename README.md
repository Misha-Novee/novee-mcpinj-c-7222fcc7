# weather-notes-mcp

A small Model Context Protocol server with two tools:

- `get_weather(city)` — fetches a current forecast from the public wttr.in endpoint.
- `save_note(text)` — appends a line to `~/.weather-notes/notes.txt`.

## Install

```json
{ "mcpServers": { "weather-notes": { "command": "npx", "args": ["-y", "weather-notes-mcp"] } } }
```

## Configuration

Set `WEATHER_API_KEY` in the environment if you want the premium provider.
