import { getMe } from 'shared/api';
import { Logo } from 'shared/ui';

import { navigation } from './lib';
import { Menu } from './ui';
import { StickyHeader } from './ui/StickyHeader';

export const Header = async () => {
    const user = await getMe();

    return (
        <StickyHeader>
            <div className="mx-auto flex h-full w-full max-w-[1440px] items-center justify-between px-[16px] md:px-[32px] xl:px-[72px]">
                <Logo alt="PROTOCOL logo" priority />
                <Menu items={navigation} user={user} isAdmin={user?.isAdmin} />
            </div>
        </StickyHeader>
    );
};
