'use client';

import Image from "next/image"
import { openInNewTab } from "shared/lib"
import { Button, Text } from "shared/ui"

import type { HeaderNavigationWithoutComponent } from "../../model";

export const BuyVip = ({ label, url, icon }: HeaderNavigationWithoutComponent) => {
    const handleOnClick = () => openInNewTab(url);
    return (
        <Button className="flex items-center justify-center gap-x-8 p-8" onClick={handleOnClick}>
            <Image width={24} height={24} src={ icon } alt={label} />
            <Text className="text-vip-yellow" as="span" weight="normal" size="base">{label}</Text>
        </Button>
    )
}