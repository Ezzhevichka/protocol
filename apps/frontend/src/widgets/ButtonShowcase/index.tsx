'use client';

import Image from 'next/image';

import { Button, ButtonVariant, ButtonAppearance, ButtonSize, ButtonState } from 'shared/ui';

type ButtonCombo = {
  variant: ButtonVariant;
  appearance: ButtonAppearance;
  size: ButtonSize;
};

const BUTTON_STATES: ButtonState[] = [ButtonState.Default, ButtonState.Hover, ButtonState.Disabled];

const BUTTON_COMBOS: ButtonCombo[] = [
  { variant: ButtonVariant.Primary, appearance: ButtonAppearance.Accent, size: ButtonSize.L },
  { variant: ButtonVariant.Primary, appearance: ButtonAppearance.Neutral, size: ButtonSize.L },
  { variant: ButtonVariant.Primary, appearance: ButtonAppearance.Positive, size: ButtonSize.L },
  { variant: ButtonVariant.Primary, appearance: ButtonAppearance.Vip, size: ButtonSize.L },
  { variant: ButtonVariant.Primary, appearance: ButtonAppearance.Discord, size: ButtonSize.L },
  { variant: ButtonVariant.Primary, appearance: ButtonAppearance.Accent, size: ButtonSize.M },
  { variant: ButtonVariant.Primary, appearance: ButtonAppearance.Neutral, size: ButtonSize.M },
  { variant: ButtonVariant.Primary, appearance: ButtonAppearance.Positive, size: ButtonSize.M },
  { variant: ButtonVariant.Primary, appearance: ButtonAppearance.Accent, size: ButtonSize.S },
  { variant: ButtonVariant.Primary, appearance: ButtonAppearance.Neutral, size: ButtonSize.S },
  { variant: ButtonVariant.Secondary, appearance: ButtonAppearance.Accent, size: ButtonSize.L },
  { variant: ButtonVariant.Secondary, appearance: ButtonAppearance.Neutral, size: ButtonSize.L },
  { variant: ButtonVariant.Secondary, appearance: ButtonAppearance.Accent, size: ButtonSize.M },
  { variant: ButtonVariant.Secondary, appearance: ButtonAppearance.Neutral, size: ButtonSize.M },
  { variant: ButtonVariant.Secondary, appearance: ButtonAppearance.Accent, size: ButtonSize.S },
  { variant: ButtonVariant.Secondary, appearance: ButtonAppearance.Neutral, size: ButtonSize.S },
  { variant: ButtonVariant.Tertiary, appearance: ButtonAppearance.Accent, size: ButtonSize.L },
  { variant: ButtonVariant.Tertiary, appearance: ButtonAppearance.Neutral, size: ButtonSize.L },
  { variant: ButtonVariant.Tertiary, appearance: ButtonAppearance.Accent, size: ButtonSize.M },
  { variant: ButtonVariant.Tertiary, appearance: ButtonAppearance.Neutral, size: ButtonSize.M },
  { variant: ButtonVariant.Tertiary, appearance: ButtonAppearance.Accent, size: ButtonSize.S },
  { variant: ButtonVariant.Tertiary, appearance: ButtonAppearance.Neutral, size: ButtonSize.S },
];

const getLogLabel = (combo: ButtonCombo, state: ButtonState) =>
  `variant=${combo.variant}; appearance=${combo.appearance}; size=${combo.size}; state=${state}`;

export function ButtonShowcase() {
  const handleClick = (combo: ButtonCombo, state: ButtonState) => () => {
    console.log(`[ButtonKit] ${getLogLabel(combo, state)}`);
  };

  return (
    <section className="mt-32 flex w-full flex-col gap-20">
      <h2 className="text-xl font-semibold text-white-primary">Button Kit Showcase</h2>

      <div className="flex w-full flex-col gap-16">
        {BUTTON_COMBOS.map((combo) => (
          <div
            key={`${combo.variant}-${combo.appearance}-${combo.size}`}
            className="flex w-full flex-wrap items-center gap-12"
          >
            <span className="min-w-xs text-sm text-white-primary">
              {combo.variant} / {combo.appearance} / {combo.size}
            </span>

            {BUTTON_STATES.map((state) => (
              <Button
                key={`${combo.variant}-${combo.appearance}-${combo.size}-${state}`}
                variant={combo.variant}
                appearance={combo.appearance}
                size={combo.size}
                state={state}
                onClick={handleClick(combo, state)}
              >
                Текст
              </Button>
            ))}
          </div>
        ))}
      </div>

      <div className="flex w-full flex-col gap-16">
        <h3 className="text-sm font-semibold text-white-primary">Icon only</h3>
        <div className="flex flex-wrap items-center gap-12">
          {BUTTON_STATES.map((state) => (
            <Button
              key={`icon-only-${state}`}
              variant={ButtonVariant.Primary}
              appearance={ButtonAppearance.Accent}
              size={ButtonSize.L}
              state={state}
              showRightIcon
            />
          ))}
        </div>
      </div>

      <div className="flex w-full flex-col gap-16">
        <h3 className="text-sm font-semibold text-white-primary">Custom icon</h3>
        <Button
          showLeftIcon
          leftIcon={<Image src="/kits/automatics_rifleman_kit.svg" alt="" width={30} height={30} />}
        />
      </div>
    </section>
  );
}
