import { useEffect, useRef, useState } from "react";
import { Button, Card, Input, Modal, Grid } from "semantic-ui-react";

import CommentButton from "./CommentButton";
import LikeButton from "./LikeButton";
import postComment from "../functions/PostComment";
import getComments from "../functions/GetComments";
import { useAuth } from "../context/Auth";
import Avatar from "./Avatar";
import CommentsSection from "./CommentsSection";

const PostCard = ({ post, setOpen, open, incrementCount }) => {
  const {
    id,
    text,
    firstName: authorFirstName,
    lastName: authorLastName,
    media,
    likeCount,
    commentCount: comments,
  } = post;

  const {
    user: { uid: userId, firstName, lastName },
  } = useAuth();

  const [comment, setComment] = useState("");
  const [commentCount, setCommentCount] = useState(comments);
  const [commentsList, setCommentsList] = useState([]);
  const [uploadingComment, setUploadingComment] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    getComments(id).then((list) => setCommentsList(list));
  }, [id]);

  const handleSubmit = async () => {
    setUploadingComment(true);
    try {
      const newComment = await postComment(
        id,
        userId,
        firstName,
        lastName,
        comment
      );
      setCommentCount(commentCount + 1);
      incrementCount(commentCount);
      setCommentsList([newComment, ...commentsList]);
    } catch (error) {}
    setUploadingComment(false);
    setComment("");
  };

  return (
    <Modal
      size="large"
      open={open}
      onClose={() => setOpen(false)}
      closeIcon
      closeOnDimmerClick={false}
    >
      <Modal.Content>
        <Grid>
          <Grid.Column width="10">
            <Card style={{ height: "100%" }} fluid>
              <Card.Content>
                <Avatar
                  authorFirstName={authorFirstName}
                  authorLastName={authorLastName}
                />
              </Card.Content>
              <Card.Content style={{ height: "100%" }}>
                <p>{text}</p>
              </Card.Content>
              {media && <img alt="post-media" width="100%" src={media} />}
              <Card.Content>
                <LikeButton postId={id} userId={userId} likes={likeCount} />
                <CommentButton
                  commentCount={commentCount}
                  onClick={() => inputRef.current.focus()}
                />
              </Card.Content>
            </Card>
          </Grid.Column>
          <Grid.Column width="6">
            <Card style={{ height: "100%" }} fluid>
              <Card.Content>
                <Input
                  fluid
                  size="mini"
                  ref={inputRef}
                  value={comment}
                  icon="comment"
                  iconPosition="left"
                  placeholder="Write a comment"
                  loading={uploadingComment}
                  onChange={(event) => setComment(event.target.value)}
                  action={
                    <Button
                      color="blue"
                      disabled={comment.trim().length === 0}
                      icon="edit"
                      onClick={handleSubmit}
                    />
                  }
                />
              </Card.Content>
              <Card.Content style={{ height: "100%" }}>
                <Modal.Content scrolling>
                  <CommentsSection commentsList={commentsList} />
                </Modal.Content>
              </Card.Content>
            </Card>
          </Grid.Column>
        </Grid>
      </Modal.Content>
    </Modal>
  );
};

export default PostCard;
