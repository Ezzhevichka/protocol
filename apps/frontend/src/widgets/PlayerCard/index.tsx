import Image from 'next/image';
import { resolveKitIcon } from 'shared/constants';
import { resolveKitIconSize } from 'shared/constants';
import { Text } from 'shared/ui';

import type { PlayerCardProps } from './model';

const PLAYER_CARD_COLORS = {
    divider: 'var(--player-card-divider, #142438)',
    text: 'var(--player-card-text, #FAFAFA)',
    caption: 'var(--player-card-caption, #808080)',
    role: 'var(--player-card-role, #009BFE)',
    hash: 'var(--player-card-hash, #07A2FF)',
} as const;

const formatHash = (hashNumber?: string | number) => {
    if (hashNumber === undefined || hashNumber === null) {
        return null;
    }

    const value = `${hashNumber}`.trim();

    if (!value) {
        return null;
    }

    return value.startsWith('#') ? value : `#${value}`;
};

export const PlayerCard = ({
    kitName,
    kitIcon,
    nickname,
    caption,
    role,
    hashNumber,
    variant = 'default',
    showDivider = true,
    className = '',
}: PlayerCardProps) => {
    const isExtended = variant === 'extended';
    const formattedHash = formatHash(hashNumber);
    const resolvedKitName = kitName ?? role;
    const resolvedIcon = kitIcon ?? resolveKitIcon(resolvedKitName);
    const iconSize = resolveKitIconSize(resolvedKitName);

    return (
        <div
            className={`flex items-center gap-6 px-10 ${isExtended ? 'py-2' : 'h-44'} ${className}`}
            style={showDivider ? { borderBottom: "1px solid rgba(255,255,255,0.06)" } : undefined}
        >
            <span className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden">
                <Image
                    src={resolvedIcon}
                    alt=""
                    aria-hidden="true"
                    width={iconSize.width}
                    height={iconSize.height}
                    unoptimized={true}
                    className="block h-auto w-auto"
                />
            </span>

            {isExtended ? (
                <div className="flex min-w-0 flex-1 flex-col justify-center gap-2">
                    <div className="flex min-w-0 items-center gap-2">
                        <Text
                            as="p"
                            size="base"
                            weight="normal"
                            className="truncate font-manrope leading-22"
                            style={{ color: PLAYER_CARD_COLORS.text }}
                        >
                            {nickname}
                        </Text>
                        {role ? (
                            <span className="flex items-center justify-center rounded px-10 py-2">
                                <Text
                                    as="span"
                                    size="sm"
                                    weight="medium"
                                    className="font-manrope leading-16 tracking-[0.28px]"
                                    style={{ color: PLAYER_CARD_COLORS.role }}
                                >
                                    {role}
                                </Text>
                            </span>
                        ) : null}
                    </div>

                    {caption || formattedHash ? (
                        <div className="flex min-w-0 items-center gap-2">
                            {caption ? (
                                <Text
                                    as="span"
                                    size="sm"
                                    weight="medium"
                                    className="truncate font-manrope leading-16 tracking-[0.28px]"
                                    style={{ color: PLAYER_CARD_COLORS.caption }}
                                >
                                    {caption}
                                </Text>
                            ) : null}

                            {formattedHash ? (
                                <span className="flex items-center justify-center rounded px-10 py-2">
                                    <Text
                                        as="span"
                                        size="sm"
                                        weight="medium"
                                        className="font-manrope leading-16 tracking-[0.28px]"
                                        style={{ color: PLAYER_CARD_COLORS.hash }}
                                    >
                                        {formattedHash}
                                    </Text>
                                </span>
                            ) : null}
                        </div>
                    ) : null}
                </div>
            ) : (
                <Text
                    as="p"
                    size="base"
                    weight="normal"
                    className="font-manrope leading-22"
                    style={{ color: PLAYER_CARD_COLORS.text }}
                >
                    {nickname}
                </Text>
            )}
        </div>
    );
};
