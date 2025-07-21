import "./App.css";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Label } from "./components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "./components/ui/radio-group";

export type Option = {
  label: string;
  htmlFor: string;
  id: string;
};

type PollCardProps = {
  createPoll: (event: React.FormEvent<HTMLFormElement>) => void;
  options: Option[];
  deleteOption: (index: number) => void;
  addToOptions: () => void;
};

function CreatePollCard({
  createPoll,
  options,
  deleteOption,
  addToOptions,
}: PollCardProps) {
  const pollPrivacy = [
    {
      id: "private",
      text: "Private",
    },
    {
      id: "public",
      text: "Public",
    },
  ];
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Create a poll</CardTitle>
        <CardDescription>Enter poll details</CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup className="flex bg-muted p-1 rounded-lg">
          {pollPrivacy.map((option) => (
            <div key={option.id} className="flex-1">
              <RadioGroupItem
                value={option.id}
                id={option.id}
                className="peer sr-only"
              />
              <Label
                htmlFor={option.id}
                className="flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium ring-offset-background transition-all hover:bg-background hover:text-foreground peer-data-[state=checked]:bg-background peer-data-[state=checked]:text-foreground cursor-pointer"
              >
                {option.text}
              </Label>
            </div>
          ))}
        </RadioGroup>
        <form onSubmit={createPoll} className="pt-6">
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="question">Qestion</Label>
              <Input
                id="question"
                type="text"
                placeholder="Question"
                required
              />
            </div>
            <div className="grid gap-2">
              {options.map((option, index) => (
                <div key={option.id} className="flex flex-col gap-2">
                  <div className="flex items-center">
                    <Label htmlFor={option.htmlFor}>{option.label}</Label>
                  </div>
                  <div className="flex gap-4">
                    <Input id={option.id} type="text" required />
                    <Button
                      variant="destructive"
                      onClick={() => {
                        deleteOption(index);
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col mt-8 gap-3">
            <Button className="w-full" onClick={addToOptions}>
              Add option
            </Button>
            <Button type="submit" className="w-full">
              Create
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function App() {
  const [options, setOptions] = useState([
    {
      label: "Option 1",
      htmlFor: "option-1",
      id: "option-1",
    },
  ]);

  function addToOptions() {
    setOptions((prev) => [
      ...prev,
      {
        label: `Option ${prev.length + 1}`,
        htmlFor: `option-${prev.length + 1}`,
        id: `option-${prev.length + 1}`,
      },
    ]);
  }

  function deleteOption(index: number) {
    const filteredOptions = options.filter((_, i) => i != index);

    const updatedOptions = filteredOptions.map((_, index) => {
      return {
        label: `Option ${index + 1}`,
        htmlFor: `option-${index + 1}`,
        id: `option-${index + 1}`,
      };
    });

    setOptions(updatedOptions);
  }

  async function createPoll(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const questionInput = form.elements.namedItem(
      "question"
    ) as HTMLInputElement;

    const optionsInputs = [];

    for (const option of options) {
      const optionInput = form.elements.namedItem(
        option.id
      ) as HTMLInputElement;

      optionsInputs.push({
        text: optionInput.value,
      });
    }

    const pollData = {
      question: questionInput.value,
      activeDays: 1,
      options: optionsInputs,
    };

    try {
      const response = await fetch("http://localhost:3005/poll/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pollData),
      });

      const data = await response.json();
      const pollLink = `http://localhost:5173/poll/${data.id}`;
      toast.success("Poll created successfully!", {
        description: `Copy this link: ${pollLink}`,
        duration: 5000,
        action: {
          label: "Copy",
          onClick: () => navigator.clipboard.writeText(pollLink),
        },
      });
    } catch (error) {
      toast.error("Oops something went wrong!");
    }
  }

  return (
    <div>
      <h1 className="text-7xl font-semibold text-center mt-10">
        Polling system
      </h1>
      <div className="flex min-h-svh flex-col items-center mt-40">
        <CreatePollCard
          options={options}
          deleteOption={deleteOption}
          addToOptions={addToOptions}
          createPoll={createPoll}
        />
      </div>
    </div>
  );
}

export default App;
