//TODO добавить ник (кликабельный, кнопка на профиль) + кнопку выйти после успешного входа.
'use client';

import Image from 'next/image';
import { Button, Text } from 'shared/ui';

import type { HeaderNavigationWithoutComponent } from '../../model';

export const Login = ({ label, url, icon }: HeaderNavigationWithoutComponent) => {
    const handleOnClick = () => { if (url) window.location.href = url; };
    return (
        <Button className="flex items-center justify-center gap-x-8 p-8" onClick={handleOnClick}>
            <Image width={24} height={24} src={icon} alt={label} />
            <Text className="text-white-primary" as="span" weight="normal" size="base">
                {label}
            </Text>
        </Button>
    );
};
