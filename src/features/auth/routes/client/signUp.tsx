import { CardLayout } from "@/components/elements/CardLayout";
import { Flex } from "@/components/elements/Flex";
import { FormContainer } from "@/components/elements/FormContainer";
import { Grid } from "@/components/elements/Grid";
import { GridContainer } from "@/components/elements/GridContainer";
import { Select } from "@/components/elements/Select";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { users } from "@/db/schema";
import {
  getFormOptions,
  type FormOptionsResponse,
} from "@/features/auth/api/formOptions";
import type { SignUpRoute } from "@/features/auth/routes/server/signUp/signUp.controller";
import { type SignUpSchema, signUpSchema } from "@/schemas/signUp";
import { getSession } from "@hono/auth-js/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { hc } from "hono/client";
import { useForm } from "react-hook-form";
import { useLoaderData } from "react-router-dom";

const toItems = (data: { id: number; name: string }[]) =>
  data.map(({ id, name }) => ({ label: name, value: id }));

const genderItems = users.gender.enumValues.map((v) => ({
  label: v,
  value: v,
}));

export const signUpLoader = async () => await getFormOptions();

export const SignUp = () => {
  const { occupations, objectives } = useLoaderData() as FormOptionsResponse; //FIXME: as を使わず型付け

  const form = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
    mode: "onSubmit",
    defaultValues: async () => ({
      name: (await getSession())?.user?.name ?? "",
    }),
  });

  const { control, handleSubmit } = form;

  const { toast } = useToast();

  const onSubmit = handleSubmit(async (data) => {
    const client = hc<SignUpRoute>("/");
    try {
      const res = await client.api.signup.$post({ json: data });
      if (res.status === 201) {
        toast({
          title: "登録ありがとうございます！",
          description: "登録記念ポイントを付与しました！",
        });
      } else if (res.status >= 400) {
        toast({
          title: "登録に失敗しました",
          description: "入力内容に誤りがあります。",
          variant: "destructive",
        });
      } else if (res.status >= 500) {
        toast({
          title: "登録に失敗しました",
          description:
            "再度登録を行ってください。このメッセージが繰り返し表示されるようであれば公式 LINE までご連絡をお願いいたします。",
          variant: "destructive",
        });
      }
    } catch (e) {}
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <Grid>
          <GridContainer>
            <CardLayout
              title="ユーザ登録"
              desc="登録に必要な情報を入力してください"
            >
              <Flex direction="col" gap="xl">
                <Flex direction="col" gap="md">
                  <FormField
                    control={control}
                    name="name"
                    render={({ field }) => (
                      <FormContainer label="ユーザ名">
                        <Input type="text" {...field} />
                      </FormContainer>
                    )}
                  />
                  <Flex direction="row">
                    <FormField
                      control={control}
                      name="birthDate"
                      render={({ field }) => (
                        <FormContainer label="生年月日">
                          <Input type="date" {...field} />
                        </FormContainer>
                      )}
                    />
                    <FormField
                      control={control}
                      name="gender"
                      render={({ field: { onChange, value } }) => (
                        <FormContainer label="性別">
                          <Select
                            placeholder="性別を選択"
                            items={genderItems}
                            onValueChange={onChange}
                          />
                        </FormContainer>
                      )}
                    />
                  </Flex>
                  <FormField
                    control={control}
                    name="occupationId"
                    render={({ field: { onChange, value } }) => (
                      <FormContainer label="職業">
                        <Select
                          placeholder="職業を選択"
                          items={toItems(occupations)}
                          onValueChange={onChange}
                        />
                      </FormContainer>
                    )}
                  />
                  <FormField
                    control={control}
                    name="objectiveId"
                    render={({ field: { onChange, value } }) => (
                      <FormContainer label="使用目的">
                        <Select
                          placeholder="使用目的を選択"
                          items={toItems(objectives)}
                          onValueChange={onChange}
                        />
                      </FormContainer>
                    )}
                  />
                </Flex>
                <Button type="submit">Oboe に登録する</Button>
              </Flex>
            </CardLayout>
          </GridContainer>
        </Grid>
      </form>
    </Form>
  );
};
