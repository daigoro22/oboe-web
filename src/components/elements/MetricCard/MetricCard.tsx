import { Flex } from "@/components/elements/Flex";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type * as React from "react";

export type MetricCardProps = {
  title: string;
  icon: React.ReactNode;
  desc: string;
  buttonParent?: (
    // biome-ignore lint/complexity/noBannedTypes: <explanation>
    props: React.PropsWithChildren<{}>,
  ) => React.ReactElement | null;
  buttonText: string;
};
export const MetricCard = ({
  title,
  icon,
  desc,
  buttonParent,
  buttonText,
}: MetricCardProps) => {
  const button = (
    <Button className="text-xs px-3 py-1 h-5" variant="outline">
      {buttonText}
    </Button>
  );
  return (
    <Card>
      <CardHeader className="px-3 pt-3 pb-2">
        <Flex
          direction="row"
          gap="md"
          alignItems="center"
          justifyContent="between"
        >
          <CardTitle className="text-xs font-normal">{title}</CardTitle>
          {icon}
        </Flex>
      </CardHeader>
      <CardContent className="pt-0 px-3 pb-3">
        <Flex
          direction="row"
          gap="md"
          alignItems="center"
          justifyContent="between"
        >
          <p className="text-xl align-bottom font-semibold leading-none">
            {desc}
          </p>
          {buttonParent ? buttonParent({ children: button }) : button}
        </Flex>
      </CardContent>
    </Card>
  );
};
