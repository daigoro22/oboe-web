import { CardLayout } from "@/components/elements/CardLayout";
import { Flex } from "@/components/elements/Flex";
import { Grid } from "@/components/elements/Grid";
import { GridContainer } from "@/components/elements/GridContainer";
import { InputContainer } from "@/components/elements/InputContainer";
import { Select } from "@/components/elements/Select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SessionProvider, useSession } from "@hono/auth-js/react";
import { createRoot } from "react-dom/client";

const Content = () => {
	const { data, status } = useSession();

	return (
		<Grid>
			<GridContainer>
				<CardLayout
					title="ユーザ登録"
					desc="登録に必要な情報を入力してください"
				>
					<Flex direction="col" gap="xl">
						<Flex direction="col" gap="md">
							<InputContainer htmlFor="name" label="ユーザ名">
								<Input id="name" type="text" value={data?.user?.name ?? ""} />
							</InputContainer>
							<Flex direction="row">
								<InputContainer htmlFor="birthDate" label="生年月日">
									<Input id="birthDate" type="date" />
								</InputContainer>
								<InputContainer htmlFor="sex" label="性別">
									<Select id="sex" placeholder="性別を選択" items={[]} />
								</InputContainer>
							</Flex>
							<InputContainer htmlFor="occupation" label="職業">
								<Select id="occupation" placeholder="職業を選択" items={[]} />
							</InputContainer>
							<InputContainer htmlFor="objective" label="使用目的">
								<Select
									id="objective"
									placeholder="使用目的を選択"
									items={[]}
								/>
							</InputContainer>
						</Flex>
						<Button>Oboe に登録する</Button>
					</Flex>
				</CardLayout>
			</GridContainer>
		</Grid>
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
