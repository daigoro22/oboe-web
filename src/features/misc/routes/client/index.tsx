import { CardLayout } from "@/components/elements/CardLayout";
import { Grid } from "@/components/elements/Grid";
import { StudyStreakCard } from "@/features/misc/components/StudyStreakCard";
import { UserPointsCard } from "@/features/misc/components/UserPointsCard";

const Index = () => {
  return (
    <Grid>
      <div className="col-span-2">
        <StudyStreakCard />
      </div>
      <div className="col-span-2">
        <UserPointsCard />
      </div>
    </Grid>
  );
};

export default Index;
