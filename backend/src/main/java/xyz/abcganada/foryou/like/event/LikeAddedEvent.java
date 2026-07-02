package xyz.abcganada.foryou.like.event;

import xyz.abcganada.foryou.like.domain.TargetType;

public record LikeAddedEvent(TargetType targetType, Long targetId, Long senderId) {
}
