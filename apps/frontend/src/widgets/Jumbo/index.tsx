'use client';

import Image from "next/image";
import { openInNewTab } from "shared/lib";
import { Button, ButtonAppearance, ButtonSize, ButtonVariant } from "shared/ui";

import type { JumboProps } from "./model";

const JUMBO_COLORS = {
  overlay: "rgba(0, 0, 0, 0.65)",
  tagline: "#FAFAFA",
} as const;

export const Jumbo = ({
  backgroundSrc,
  logoSrc = "/general/protocol-logo-image.png",
  discordUrl,
  vipUrl,
  className = "",
}: JumboProps) => {
  return (
    <section className={`relative h-640 w-full overflow-hidden ${className}`}>
      {/* Background */}
      <Image
        src={backgroundSrc}
        alt=""
        aria-hidden="true"
        fill
        className="object-cover"
        priority
        unoptimized
      />

      {/* Dark overlay */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: JUMBO_COLORS.overlay }}
      />

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-127 bg-gradient-to-b from-transparent to-background" />

      {/* Logo */}
      <div className="absolute left-1/2 top-20 h-320 w-320 -translate-x-1/2">
        <Image
          src={logoSrc}
          alt="PROTOCOL"
          fill
          className="object-contain"
          priority
          unoptimized
        />
      </div>

      {/* Tagline */}
      <p
        className="absolute left-1/2 top-356 w-856 -translate-x-1/2 text-center font-manrope text-[32px] font-medium leading-40"
        style={{ color: JUMBO_COLORS.tagline }}
      >
        Комьюнити, где командная игра имеет значение
      </p>

      {/* CTA buttons */}
      <div className="absolute left-1/2 top-534 flex w-710 -translate-x-1/2 items-center gap-24">
        <Button
          variant={ButtonVariant.Primary}
          appearance={ButtonAppearance.Discord}
          size={ButtonSize.L}
          className="w-270"
          onClick={discordUrl ? () => openInNewTab(discordUrl) : undefined}
        >
          Наш Discord
        </Button>
        <Button
          variant={ButtonVariant.Primary}
          appearance={ButtonAppearance.Vip}
          size={ButtonSize.L}
          className="flex-1"
          onClick={vipUrl ? () => openInNewTab(vipUrl) : undefined}
        >
          Купить VIP статус
        </Button>
      </div>
    </section>
  );
};
