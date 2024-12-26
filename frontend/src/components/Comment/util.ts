import { CommentResponseDto } from '../../domain';
// Solution 1
// Bad performance
// TODO : optimize
// As i know, recursive slower than Nested Set Model Pointer left to right
// It need to optimize Database before render JSON return to FE
export const nestedCommentTree = (comments: CommentResponseDto[]) => {
    if (comments.length > 0) {
        const nestedComment = (items: any, id: number | null, link = 'parentId') =>
            items
                .filter((item: { [x: string]: number | null }) => item[link] === id)
                .map((item: { id: number | null }) => ({ ...item, children: nestedComment(items, item.id) }));
        return nestedComment(comments, null);
    }
    return [];
};
