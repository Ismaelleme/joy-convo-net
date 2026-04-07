export type Post = {
  id: string;
  author: string;
  content: string;
  likes: number;
};

export type Contact = {
  id: string;
  name: string;
  online: boolean;
};

export type Message = {
  id: string;
  from: string;
  text: string;
  at: string;
};
