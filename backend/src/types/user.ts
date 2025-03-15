export interface User {
  id: string;
  email: string;
  password: string;
  bookmarkedContests: string[];
  isAdmin: boolean;
}
