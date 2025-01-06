import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";

interface TabsComponentProps {
  tabOptions: {
    label: React.ReactNode;
    value: string;
    content: React.ReactNode;
    default?: boolean;
  }[];
  setDialog?: any;
}

export default function TabsComponent({ tabOptions }: TabsComponentProps) {
  return (
    <Tabs defaultValue={tabOptions.find((tab) => tab.default)?.value}>
      <TabsList className={"flex w-full bg-gray-200"}>
        {tabOptions.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value} className="w-full">
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      <div />
      {tabOptions.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}
