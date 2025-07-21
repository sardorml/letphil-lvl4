import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";

export type Poll = {
  createdAt: Date;
  deadline: Date;
  id: string;
  question: string;
  options: {
    text: string;
    vote: number;
  }[];
};

function PollsPage() {
  const [polls, setPolls] = useState<Poll[]>([]);

  async function fetchPolls() {
    try {
      const response = await fetch("http://localhost:3005/polls");
      const data: Poll[] = await response.json();

      setPolls(data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchPolls();
  }, []);

  return (
    <div className="flex justify-center">
      <div className="flex flex-col w-full items-center gap-4 pt-4">
        {polls.map((poll) => (
          <Card key={poll.id} className="w-1/3">
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
        ))}
      </div>
    </div>
  );
}

export default PollsPage;
