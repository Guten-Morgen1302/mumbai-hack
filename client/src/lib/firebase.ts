// Temporarily disable Firebase to get the app running
// We'll implement a mock auth system until Firebase is properly configured

console.log('Using mock Firebase implementation for development');

// Mock auth object that mimics Firebase Auth interface
const mockAuth = {
  currentUser: null,
  onAuthStateChanged: (callback: (user: any) => void) => {
    // Simulate no user logged in
    setTimeout(() => callback(null), 100);
    return () => {}; // unsubscribe function
  }
};

// Mock database object
const mockDb = {};

export const auth = mockAuth;
export const db = mockDb;
export default null;