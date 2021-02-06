import { useState, useEffect } from "react";
import { storage, firestore, timestamp } from "../firebase/config";

const useStorage = (post) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log({ post });
    // Saves the new post to firestore
    const savePost = async ({
      uid,
      userFirstName,
      userLastName,
      text,
      media,
    }) => {
      try {
        await firestore.collection("posts").add({
          userId: uid,
          userFirstName,
          userLastName,
          text,
          media,
          createdAt: timestamp(),
        });
      } catch (error) {
        setError(error);
        console.log(error.message);
      }
      setIsLoading(false);
    };

    if (post) {
      setIsLoading(true);
      if (post.media) {
        const file = post.media;
        const fileRef = storage.ref(file.name);

        fileRef.put(file).on(
          "state_changed",
          null,
          (error) => setError(error),
          async () => {
            const url = await fileRef.getDownloadURL();
            console.log({ url });
            savePost({
              uid: post.uid,
              userFirstName: post.userFirstName,
              userLastName: post.userLastName,
              text: post.text,
              media: url,
            });
          }
        );
      } else {
        savePost({
          uid: post.uid,
          userFirstName: post.userFirstName,
          userLastName: post.userLastName,
          text: post.text,
          media: null,
        });
      }
    }
  }, [post]);

  return { isLoading, error };
};

export default useStorage;
