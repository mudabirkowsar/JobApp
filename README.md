Offline-First Contractor Job App
1. App Architecture
The application follows a Provider-Pattern architecture using React Native’s Context API. This separates the concerns into three distinct layers:
UI Layer: Functional components using useContext to consume state and trigger actions.
Logic/State Layer (Contexts):
AuthContext: Manages session tokens, user profile data, and global authentication state.
SyncContext: The "brain" of the app. It manages the SQLite database, handles optimistic UI updates, and orchestrates the background synchronization queue.
Persistence Layer:
AsyncStorage: Used for small, global key-value pairs (Auth tokens, last logged-in UserID).
SQLite (expo-sqlite): Used for relational, user-specific data (Jobs, Notes, and the Sync Queue).
2. Local Storage Strategy & Multi-User Isolation
To ensure Data Integrity and User Privacy, the app utilizes an SQLite-First strategy.
Relational Mapping: Every Job and Note entry in the database is tagged with a user_id.
Isolation: When a user logs in, the SyncContext queries the database using WHERE user_id = ?. This prevents a "data leak" where different accounts might see the same locally stored jobs.
Cleanup: Upon logout, the local UI state is explicitly wiped, and the database connection is effectively filtered to the new user’s ID upon the next login.
3. Sync Approach (Jobs, Notes, Video)
The app uses a Persistent Background Sync Queue:
Optimistic UI: When a user creates a job or note, it is immediately inserted into the local SQLite database and reflected in the UI. The user perceives the app as "instant," regardless of network status.
The Queue: Simultaneously, a "Sync Task" is inserted into the sync_queue table.
Automatic Trigger: The app monitors network connectivity using @react-native-community/netinfo. As soon as the device transitions from Offline 
→
→
 Online, the queue processor iterates through pending tasks and executes the corresponding API calls (POST, PUT).
Videos: Videos are stored as local URIs. The queue handles the multipart/form-data upload once a stable connection is detected.
4. How Offline Scenarios are Handled
Creation/Editing: Users can perform all CRUD operations on jobs and notes while offline. SQLite acts as the "Source of Truth."
App Lifecycle: Because the sync queue is stored in SQLite (not just in-memory RAM), pending changes survive app crashes or manual restarts.
UI Feedback: A global NetworkBanner component informs the user of their current status and how many changes are waiting to be synced.
5. Failure and Retry Handling
Non-Blocking Processing: The sync engine processes the queue sequentially. If a specific task fails due to a Client Error (400/404), it is removed from the queue to prevent a "poison pill" blocking other tasks.
Automatic Retries: If a task fails due to a Server Error (500) or Timeout, it remains in the queue. The engine will re-attempt the sync on the next network change or app launch.
Unauthorized (401): Handled by an Axios interceptor that triggers a logout, preserving data integrity by preventing unauthenticated sync attempts.
6. Known Limitations
Conflict Resolution: Currently, the app follows a "Last Write Wins" approach. If a job is edited on two different devices while offline, the last one to sync will overwrite the previous one.
Large Video Files: Very large videos may fail if the app is moved to the background for an extended period during upload (iOS/Android OS limitations).
7. Production Improvements
Delta Sync: Instead of re-fetching the entire job list, implement a timestamp-based sync to only download changes since the last sync.
Background Tasks: Use expo-task-manager or react-native-background-fetch to process the sync queue even when the app is completely closed.
Image/Video Compression: Implement client-side compression before adding video tasks to the queue to save user data and improve sync speed.
Encrypted SQLite: Use an encrypted version of SQLite (SQLCipher) to protect sensitive contractor data at rest on the device.
Technical Stack
Framework: React Native (Expo)
Database: expo-sqlite
Networking: axios
Navigation: @react-navigation/stack
State Management: Context API
Connectivity Monitoring: @react-native-community/netinfo
Setup Instructions
Clone the repository.
Install dependencies: npm install or yarn install.
Start the project: npx expo start.
Ensure you have an Android/iOS emulator or a physical device with the Expo Go app.
