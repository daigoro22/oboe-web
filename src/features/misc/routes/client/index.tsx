import { CardLayout } from "@/components/elements/CardLayout";
import { Grid } from "@/components/elements/Grid";
import { StudyStreakCard } from "@/features/misc/components/StudyStreakCard";

const Index = () => {
  return (
    <Grid>
      <div className="col-span-2">
        <StudyStreakCard streak={1} />
      </div>
    </Grid>
  );
};

export default Index;
