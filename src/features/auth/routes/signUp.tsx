import { CardLayout } from "@/components/elements/CardLayout";
import { Flex } from "@/components/elements/Flex";
import { FormContainer } from "@/components/elements/FormContainer";
import { Grid } from "@/components/elements/Grid";
import { GridContainer } from "@/components/elements/GridContainer";
import { Select } from "@/components/elements/Select";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { type SignUpSchema, signUpSchema } from "@/schemas/signUp";
import { SessionProvider, useSession } from "@hono/auth-js/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { createRoot } from "react-dom/client";
import { useForm } from "react-hook-form";

const Content = () => {
	const { data, status } = useSession();
	const form = useForm<SignUpSchema>({
		resolver: zodResolver(signUpSchema),
		mode: "onSubmit",
		defaultValues: { name: data?.user?.name ?? "" },
	});
	const { control, handleSubmit } = form;

	const onSubmit = handleSubmit(async (data) => {
		console.log(data);
		const res = await fetch("api/auth/signUp", {
			method: "POST",
			body: JSON.stringify(data),
		});
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
											name="sex"
											render={({ field: { onChange, value } }) => (
												<FormContainer label="性別">
													<Select
														placeholder="性別を選択"
														items={[{ label: "男", value: "man" }]}
														onValueChange={onChange}
														defaultValue={value}
													/>
												</FormContainer>
											)}
										/>
									</Flex>
									<FormField
										control={control}
										name="occupation"
										render={({ field: { onChange, value } }) => (
											<FormContainer label="職業">
												<Select
													placeholder="職業を選択"
													items={[{ label: "男", value: "man" }]}
													onValueChange={onChange}
													defaultValue={value}
												/>
											</FormContainer>
										)}
									/>
									<FormField
										control={control}
										name="objective"
										render={({ field: { onChange, value } }) => (
											<FormContainer label="使用目的">
												<Select
													placeholder="使用目的を選択"
													items={[{ label: "男", value: "man" }]}
													onValueChange={onChange}
													defaultValue={value}
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

const SignUp = () => {
	return (
		<SessionProvider>
			<Content />
		</SessionProvider>
	);
};

const domNode = document.getElementById("root");
if (domNode) {
	const root = createRoot(domNode);
	root.render(<SignUp />);
}
