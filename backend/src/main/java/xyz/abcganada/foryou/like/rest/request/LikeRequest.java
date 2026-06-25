package xyz.abcganada.foryou.like.rest.request;

import xyz.abcganada.foryou.like.domain.TargetType;

public record LikeRequest(
        TargetType targetType,
        Long targetId
) {

}
