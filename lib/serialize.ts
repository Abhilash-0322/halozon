// Helper to safely serialize Mongoose docs (with ObjectId, Date) to plain objects
// before passing to Client Components. Fixes "toJSON" serialization warnings.
export const serialize = <T>(v: T): T => JSON.parse(JSON.stringify(v));
