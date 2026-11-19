"""Channel adapters (contract sprint-09 §3.2). Adding SMS or WhatsApp later = one adapter module,
templates for that channel and a CHANNEL_POLICY entry; no feature code changes (ADR 0002)."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any, ClassVar, Literal, Protocol

from medilink.notifications.templates import LIMITS, TextLimits


@dataclass(frozen=True)
class Target:
    address: str
    subscription_id: Any = None


@dataclass(frozen=True)
class Message:
    notification_id: Any
    subject: str
    body: str
    priority: str
    language: str
    url: str
    ttl_seconds: int
    topic: str
    action_path: str = ""


@dataclass(frozen=True)
class SendResult:
    status: Literal["sent", "delivered", "failed"]
    retryable: bool = False
    failure_reason: str | None = None
    provider_message_id: str | None = None
    revoke_target: bool = False


class ChannelAdapter(Protocol):
    channel: ClassVar[str]
    interrupts: ClassVar[bool]
    limits: ClassVar[TextLimits]

    def targets(self, notification: Any) -> list[Target]: ...

    def send(self, message: Message, target: Target) -> SendResult: ...

    def is_enabled(self) -> bool: ...


# Extra fallback channels per priority, owned by S9 (P3 adds "sms" for critical).
CHANNEL_POLICY: dict[str, dict[str, tuple[str, ...]]] = {
    "extra_fallback": {"critical": (), "important": (), "routine": ()},
}

_ADAPTERS: dict[str, ChannelAdapter] = {}


def register(adapter: ChannelAdapter) -> None:
    _ADAPTERS[adapter.channel] = adapter


def get(channel: str) -> ChannelAdapter | None:
    return _ADAPTERS.get(channel)


def interrupting_channels() -> list[str]:
    return [name for name, a in _ADAPTERS.items() if a.interrupts and a.is_enabled()]


def load_default_adapters() -> None:
    from medilink.notifications.channels.email import EmailAdapter
    from medilink.notifications.channels.in_app import InAppAdapter
    from medilink.notifications.channels.web_push import WebPushAdapter

    for adapter in (InAppAdapter(), WebPushAdapter(), EmailAdapter()):
        register(adapter)


__all__ = [
    "CHANNEL_POLICY",
    "LIMITS",
    "ChannelAdapter",
    "Message",
    "SendResult",
    "Target",
    "get",
    "interrupting_channels",
    "register",
]
