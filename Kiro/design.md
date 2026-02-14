# AI Silent Teammate - Technical Design Document

## 1. System Architecture Overview

The **AI Silent Teammate** system is designed as a cloud-native, event-driven application leveraging AWS serverless technologies to provide real-time meeting intelligence. The architecture is split into two primary interfaces sharing a common backend.

### High-Level Architecture

```ascii
+-----------------------+       +-------------------------+
|   Primary Web Dashboard|       |      Liquid UI Layer    |
|       (React.js)      |       | (Electron/Chrome Ext)   |
+-----------+-----------+       +------------+------------+
            |                                |
            |        HTTPS / WebSocket       |
            +----------------+---------------+
                             |
                   +---------v---------+
                   |  AWS API Gateway  |
                   +---------+---------+
                             |
          +------------------+------------------+
          |                                     |
+---------v---------+                 +---------v---------+
|   Core Lambda     +----------------->      AWS Bedrock  |
|    Functions      <-----------------+    (LLM Reasoning)|
+---------+---------+                 +---------+---------+
          |                                     |
+---------v---------+                 +---------v---------+
| Amazon DynamoDB   |                 | Amazon Transcribe |
| (Single Table)    |                 | (Audio Processing)|
+-------------------+                 +-------------------+
```

### Components

1.  **Frontend Clients**:
    *   **Web Dashboard**: Main control center for reviewing past meetings, tasks, risks, and project memory.
    *   **Liquid UI**: Lightweight, always-on-top overlay providing real-time transcripts and AI insights during active meetings.

2.  **Backend Services (AWS)**:
    *   **Amazon Transcribe**: Converts speech to text in real-time alongside speaker diarization.
    *   **AWS Bedrock**: Orchestrates LLM calls (Claude 3 / Titan) for intent recognition, task extraction, and risk analysis.
    *   **AWS Lambda**: Serverless compute for business logic, data transformation, and API handling.
    *   **Amazon DynamoDB**: NoSQL database for flexible data storage of meetings, tasks, and vectors.
    *   **Amazon S3**: Object storage for audio recordings and export artifacts.
    *   **Amazon API Gateway**: Unified entry point for REST and WebSocket APIs.

3.  **Event Pipeline**:
    *   Audio/Text Ingestion -> EventBridge -> Lambda processing -> Bedrock Analysis -> Database Update -> WebSocket Push to Clients.

---

## 2. Liquid UI Architecture

The Liquid UI is a critical differentiator, providing a non-intrusive "silent partner" experience.

### Design Principles

*   **Always-on-Top:** Floating window with transparency controls (using Electron's `win.setAlwaysOnTop` or Chrome Extension side panel API).
*   **Minimal Footprint:** Collapses to a "bubble" or slim ticker when idle. Expands only when relevant insights are detected.
*   **Context-Aware:** Detects active video conferencing apps (Zoom, Teams, Meet) to auto-launch.

### Functional Diagram

```ascii
+---------------------+      +----------------------+
|  Meeting Application|      |      Liquid UI       |
|    (Zoom/Teams)     |      |      Overlay         |
+----------+----------+      +----------+-----------+
           |                            |
      Screen Share                      | Display
           |                            | Insights
+----------v----------+      +----------v-----------+
|  OS Screen Recorder |----->|  Visibility Manager  |
|      Detection      |      | (Hide on Share)      |
+---------------------+      +----------+-----------+
                                        ^
                                        | Real-time
                                        | Websocket
                               +--------+--------+
                               |     Backend     |
                               +-----------------+
```

### Key Features
*   **Live Transcript Stream:** Rolling text display of current speaker.
*   **Instant Insight Cards:** Pop-up cards for detected Action Items or Risks.
*   **Privacy Mode:** Automatically hides the panel when the user starts screen sharing to prevent sensitive AI output from being broadcast.

---

## 3. End-to-End Architecture Flow

### Step 1: Ingestion
1.  Liquid UI captures system audio (loopback) with user permission.
2.  Audio chunks stream to **Amazon Transcribe** via WebSocket.

### Step 2: Processing
1.  Transcribe returns partial and final transcript segments with timestamps.
2.  **Lambda** acts as an accumulator, buffering segments.
3.  Buffered text is sent to **AWS Bedrock** for immediate analysis (e.g., "Is this a task?").

### Step 3: Insight Generation
1.  Bedrock returns structured JSON (Task detected: "Update schema", Owner: "Dev Team").
2.  Lambda saves the insight to **DynamoDB**.
3.  **API Gateway (WebSocket)** broadcsts the new insight back to the Liquid UI and any open Web Dashboards.

### Step 4: Storage & aggregations
1.  Post-meeting, a summary Lambda aggregates all segments.
2.  Bedrock generates a "Meeting Minutes" document.
3.  Identify and update "Project Memory" (long-term knowledge graph) in DynamoDB.

---

## 4. Web Dashboard Design

The React application serves as the comprehensive workspace.

### Layout Structure
*   **Global Sidebar:** Navigation (Meetings, Tasks, Risks, Project Memory, Settings).
*   **Main Content Area:** Dynamic view based on selection.
*   **Context Panel:** Right-hand drawer for AI chat/querying against project data.

### Views

1.  **Meetings Hub:**
    *   List view of recent meetings with status (Processing, Completed).
    *   Calendar view of timeline.
    *   Quick actions: "View Summary", "Export".

2.  **Transcript Viewer:**
    *   Dual-pane: Video/Audio player synced with scrolling transcript.
    *   Speaker identification avatars.
    *   Search/Filter by keyword or speaker.

3.  **Tasks Board:**
    *   Kanban or List view of extracted tasks.
    *   Columns: To Do, In Progress, Done.
    *   Source link back to the specific transcript line where the task was assigned.

4.  **Risk Radar:**
    *   Heatmap or list of detected risks.
    *   Categorization (Technical, Timeline, Budget).
    *   Mitigation status checkboxes.

5.  **Project Memory:**
    *   Knowledge Graph visualization or Wiki-style view.
    *   Persisted decisions ("We decided to use AWS on Jan 14th").
    *   Key constraints and architectural choices.

---

## 5. Data Model Design

We use a Single Table Design (DynamoDB) or separate collections for distinct entities. Below is a schema overview.

### Meeting Schema
```json
{
  "PK": "MEETING#UUID",
  "SK": "METADATA",
  "title": "Architectural Review",
  "timestamp": "2023-10-27T10:00:00Z",
  "participants": ["Alice", "Bob", "Charlie"],
  "recordingUrl": "s3://bucket/meetings/audio-uuid.mp3",
  "status": "COMPLETED",
  "duration": 3600
}
```

### Transcript Segment
```json
{
  "PK": "MEETING#UUID",
  "SK": "TRANSCRIPT#TIMESTAMP#UUID",
  "speaker": "Alice",
  "text": "I will handle the API deployment by Friday.",
  "timestamp_start": 120500,
  "timestamp_end": 125000
}
```

### Task Schema
```json
{
  "PK": "TASK#UUID",
  "SK": "MEETING#UUID",
  "description": "Handle API deployment",
  "assignee": "Alice",
  "deadline": "2023-11-03", // Inferred from "Friday"
  "status": "OPEN",
  "confidence_score": 0.98,
  "source_context": "I will handle the API deployment..." 
}
```

### Risk Schema
```json
{
  "PK": "RISK#UUID",
  "SK": "MEETING#UUID",
  "category": "TIMELINE",
  "description": "Potential delay in frontend due to API dependency",
  "severity": "HIGH",
  "status": "OPEN"
}
```

### Project Memory
```json
{
  "PK": "PROJECT#MAIN",
  "SK": "MEMORY#TOPIC#DATABASE",
  "fact": "Project uses DynamoDB for main storage",
  "decision_date": "2023-10-01",
  "source_meeting": "MEETING#UUID"
}
```

---

## 6. AI Processing Design

### Prompt Engineering Strategy
We utilize a **Chain-of-Thought** approach coupled with **XML tagging** for robust parsing.

**System Prompt Example:**
> You are an expert Project Manager AI. Analyze the following meeting segment. 
> internalize the context of the conversation.
> If a commitment is made, output a <task>.
> If a potential issue is raised, output a <risk>.
> Return the result in the specified JSON format only.

### Structured Extraction
LLM output is strictly enforced to follow JSON schemas. We use library validation (e.g., Pydantic or internal validators) before persisting to DB to ensure data integrity.

### Task Extraction Logic
*   **Trigger Words:** "I will", "Can you", "Let's ensure", "Action item".
*   **Deduplication:** Fuzzy matching against existing open tasks to prevent duplicates from follow-up mentions.

### Risk Detection Logic
*   **Sentiment Analysis:** looking for hesitation, worry words ("might define", "bottleneck", "unsure", "delay").
*   **Severity Scoring:** LLM assigns High/Medium/Low based on the context (e.g., "Critical path blocked" = High).

---

## 7. Security & Privacy Design

### Data Privacy & Consent
*   **Explicit Opt-In:** Recording never starts without user initiation.
*   **PII Redaction:** Transcribe detects and masks PII (e.g., SSN, phone numbers) before storage if configured.
*   **Data Sovereignty:** All processing occurs within the customer's AWS account boundary.

### Access Control
*   **IAM Roles:** Granular permissions. Lambda functions only access specific DynamoDB partitions.
*   **Cognito User Pools:** robust authentication for Dashboard and Liquid UI users.

### Encryption
*   **At Rest:** DyanmoDB and S3 encrypted using AWS KMS (Key Management Service).
*   **In Transit:** TLS 1.3 for all WebSocket and API connections.

---

## 8. Scalability Strategy

The architecture is fully **Serverless**, ensuring automatic scaling from 0 to 1000s of concurrent meetings.

*   **Compute:** AWS Lambda scales horizontally with event traffic.
*   **Database:** DynamoDB On-Demand capacity mode handles burst writes during active meetings.
*   **Real-time:** API Gateway manages WebSocket connection persistence and message fan-out.
*   **Statelessness:** The UI clients store no persistent state; all state is reconstructed from the backend, allowing users to switch devices seamlessly.

---

## 9. Deployment Architecture

### Frontend deployment
*   **Web Dashboard:** Hosted on **Amazon S3** + **CloudFront** (CDN) for global low-latency access.
*   **Liquid UI:** Distributable binaries (Electron) or Store listing (Chrome Web Store), utilizing auto-update mechanisms (e.g., electron-updater linked to S3).

### Backend Deployment (IaC)
We use **AWS SAM (Serverless Application Model)** or **CDK (Cloud Development Kit)** for reproducible deployments.

1.  **CodeCommit / GitHub:** Source code management.
2.  **CodePipeline:** Orchestrates the build.
3.  **CodeBuild:** Runs tests (Unit, Integration).
4.  **CloudFormation:** Deploys the infrastructure stack (Lambda, DynamoDB, API Gateway).

### CI/CD Pipeline
*   **Dev Integration:** Automatic deploy to a `dev` stage environment on PR merge.
*   **Prod Release:** Manual approval gate before promoting to `production`.
