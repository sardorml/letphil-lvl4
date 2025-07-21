import { useEffect, useState } from "react";
import { useParams } from "react-router";
import type { Poll } from "./PollsPage";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

function PollPage() {
  const { id } = useParams();
  const [poll, setPoll] = useState<Poll>();

  async function fetchPoll() {
    try {
      const response = await fetch(`http://localhost:3005/poll/${id}`);
      const data = await response.json();

      setPoll(data);
      console.log(data);
    } catch (error) {
      toast.error("Something went wrong");
    }
  }

  useEffect(() => {
    fetchPoll();
  }, [id]);

  if (!poll) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex justify-center h-[100vh] items-center">
      <Card key={poll.id} className="w-1/3 pt-6">
        <CardHeader>
          <CardTitle>{poll.question}</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {poll.options.map((option, index) => {
              // Calculate total votes for this poll
              const totalVotes = poll.options.reduce(
                (sum, opt) => sum + opt.vote,
                0
              );
              // Calculate percentage (avoid division by zero)
              const percentage =
                totalVotes === 0 ? 0 : (option.vote / totalVotes) * 100;

              return (
                <li key={index}>
                  <span className="flex justify-between">
                    <span>{option.text}</span>
                    <span className="text-blue-700">{option.vote}</span>
                  </span>

                  <Progress value={percentage} className="h-3" />
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

export default PollPage;
