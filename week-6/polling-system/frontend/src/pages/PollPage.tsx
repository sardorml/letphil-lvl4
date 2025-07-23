import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VoteList, type Poll } from "@/components/PollsList";

function PollPage() {
  const { id } = useParams();
  const [poll, setPoll] = useState<Poll>();
  const [selectedOption, setSelectedOption] = useState<string>("0");
  const [hasVoted, setHasVoted] = useState<boolean>(false);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  async function fetchPoll() {
    try {
      const response = await fetch(`http://localhost:3005/poll/${id}`);
      console.log(response.status);

      if (response.status === 404) navigate("/not-found");
      const data = await response.json();

      setPoll(data);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  }

  async function castVote() {
    console.log("selected option is ", selectedOption);

    if (!id) {
      toast.error("Poll does not exist");
      return;
    }

    if (!userId && poll?.privacy === "private") {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3005/poll/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          option: Number(selectedOption),
        }),
      });
      const data = await response.json();
      setPoll(data);
      setHasVoted(true);
      localStorage.setItem(id, "true");
      toast.success("Your vote has been recorded");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  }

  useEffect(() => {
    fetchPoll();
    if (id) {
      const hasVoted = localStorage.getItem(id);
      if (hasVoted == "true") setHasVoted(true);
    }
  }, [id]);

  if (!poll) {
    return <div className="flex justify-center mt-10">Loading...</div>;
  }

  return (
    <div className="flex justify-center h-[100vh] items-center">
      <Card key={poll.id} className="w-1/3 pt-6">
        <CardHeader>
          <CardTitle className="flex justify-between">
            <span>{poll.question} </span>
            <Badge variant="default">{poll.privacy}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!hasVoted ? (
            <RadioGroup
              defaultValue={selectedOption}
              onValueChange={setSelectedOption}
            >
              {poll.options.map((option, index) => {
                return (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem value={index.toString()} id="option-one" />
                    <Label htmlFor={index.toString()}>{option.text}</Label>
                  </div>
                );
              })}
            </RadioGroup>
          ) : (
            <VoteList poll={poll} />
          )}
        </CardContent>
        <CardFooter className="flex-col gap-2">
          {!hasVoted && (
            <Button onClick={castVote} type="submit" className="w-full">
              Sumbit
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

export default PollPage;
