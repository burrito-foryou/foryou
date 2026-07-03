package xyz.abcganada.foryou.like.rest.response;

public record LikeResponse(
        boolean liked,
        Long likeCount
) {

}
