'use client';

import { useForm } from "react-hook-form";
import { z } from "zod";
import { TierFeatureSummary } from "~/app/_components/TierFeatureSummary";
import { type OrgTier } from "~/app/_domain/price-tiers";
import { Button } from "~/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "~/hooks/use-toast";
import { Input } from "~/components/ui/input";
 
 
 
// import { toast } from "@/components/hooks/use-toast"
// import { Button } from "@/components/ui/button"
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
 

const FormSchema = z.object({
  name: z.string(  {
    required_error: "You need to choose a name for your menu.",
  }),
})

export function AddMenu(props: { orgTier: OrgTier }) {

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })
 
  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }
  
  return (
    <div className="flex flex-col gap-6">
      <TierFeatureSummary orgTier={props.orgTier} />
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="The name of your menu" {...field} />
              </FormControl>
              <FormDescription>
                {"This is just for your reference. We won't display it to your customers."}
              </FormDescription>
              <FormMessage className="text-red-700 font-bold" />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
    </div>
  );
}
