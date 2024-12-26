import * as React from 'react';
import Container from '@mui/material/Container';
import './style.css';
import { CommentResponseDto } from '../../domain';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCommentSelector } from '../../reduxStore/comment/sliceReducer';
import { fetchComment } from '../../reduxStore/comment/action';
import { nestedCommentTree } from './util';
const Message = ({ message }: any) => {
    return (
        <div style={{ marginLeft: '20px', borderLeft: '1px solid #ccc', paddingLeft: '10px' }}>
            <p>{message.text}</p>
            {message.children.length > 0 && (
                <div>
                    {message.children.map((reply: { id: any }) => (
                        <Message key={reply.id} message={reply} />
                    ))}
                </div>
            )}
        </div>
    );
};

const MessageList = ({ messages }: any) => {
    return (
        <div>
            {messages.map((message: { id: any }) => (
                <Message key={message.id} message={message} />
            ))}
        </div>
    );
};

export const Comment = () => {
    const dispatch = useDispatch();
    const initialState = useSelector(fetchCommentSelector);
    const [comments, setComments] = React.useState<CommentResponseDto[]>();
    React.useEffect(() => {
        if (initialState.data && initialState.data.length > 0) {
            const commentData = nestedCommentTree(initialState.data);
            setComments(commentData);
        }
    }, [initialState]);

    React.useEffect(() => {
        dispatch(fetchComment({}));
    }, [dispatch]);
    return (
        <Container
            component="main"
            sx={{
                border: '2px solid #ccc',
                padding: '50px',
                borderRadius: '5px',
                marginTop: '10px',
            }}
        >
            {comments && comments.length > 0 ? <MessageList messages={comments} /> : ''}
        </Container>
    );
};
