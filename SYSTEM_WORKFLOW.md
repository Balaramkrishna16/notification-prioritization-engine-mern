# System Workflow & Logic

### 1. Ingestion Layer
Incoming notifications are received via `POST /api/notifications`. Each payload is validated against a strict schema (Type, Source, Content).

### 2. The Prioritization Engine
The engine applies a multi-factor scoring formula:
$$Score = (Urgency \times W_1) + (SourceReliability \times W_2) - (FrequencyPenalty \times W_3)$$
- **High Priority**: Dispatched immediately via WebSockets/Push.
- **Medium Priority**: Queued for standard delivery.
- **Low Priority**: Sent to the `LaterQueue` for asynchronous processing.

### 3. Queue Management
The `LaterQueueProcessor` runs as a background job to clear low-priority buffers during low-traffic periods.
    