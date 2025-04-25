import React, { useEffect, useState } from "react";
import BookPostCard from "./BookPostCard";
import axios from "axios";

const Posts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchAvailablePosts = async () => {
      try {
        const response = await axios.get("https://localhost:7200/api/BookPost/available");
        setPosts(response.data);
      } catch (error) {
        console.error("Failed to fetch posts", error);
      }
    };

    fetchAvailablePosts();
  }, []);

  return (
    <div className="posts-wrapper">
      {posts.map(post => (
        <BookPostCard key={post.bookPostID} book={post} />
      ))}
    </div>
  );
};

export default Posts;
