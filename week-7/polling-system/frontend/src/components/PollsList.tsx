import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import { ConfirmDelete } from "./ConfirmDelete";

export type Poll = {
  createdAt: Date;
  deadline: Date;
  privacy: "private" | "public";
  userId: string;
  id: string;
  question: string;
  options: {
    text: string;
    vote: number;
  }[];
};

export function VoteList({ poll }: { poll: Poll }) {
  return (
    <ul className="space-y-4">
      {poll.options.map((option, index) => {
        // Calculate total votes for this poll
        const totalVotes = poll.options.reduce((sum, opt) => sum + opt.vote, 0);
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
  );
}

export function PollsList({
  polls,
  onDelete,
  isLoading,
}: {
  polls: Poll[];
  onDelete: (id: string) => void;
  isLoading: boolean;
}) {
  const userId = localStorage.getItem("userId");

  return (
    <div className="flex flex-col w-full items-center gap-4 pt-4">
      {polls.map((poll) => {
        const canDelete = poll.userId === userId;

        return (
          <Card key={poll.id} className="w-1/3">
            <CardHeader>
              <CardTitle className="flex justify-between">
                <span>{poll.question} </span>
                <Badge variant="default">{poll.privacy}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <VoteList poll={poll} />
            </CardContent>
            {canDelete && (
              <CardFooter>
                <ConfirmDelete
                  trigger={<Button variant="destructive">Delete</Button>}
                  onConfirm={() => onDelete(poll.id)}
                  loading={isLoading}
                />
              </CardFooter>
            )}
          </Card>
        );
      })}
    </div>
  );
}
