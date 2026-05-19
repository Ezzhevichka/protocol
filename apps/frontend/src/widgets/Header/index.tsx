import { Logo } from 'shared/ui';

import { navigation } from './lib';
import { Menu } from './ui';

export const Header = () => {
    return (
        <header className="h-[70px] w-full bg-background">
            <div className="mx-auto flex h-full w-full max-w-[1440px] items-center justify-between px-[16px] md:px-[32px] xl:px-[72px]">
                <Logo alt="PROTOCOL logo" priority />
                <Menu items={navigation} />
            </div>
        </header>
    );
};
