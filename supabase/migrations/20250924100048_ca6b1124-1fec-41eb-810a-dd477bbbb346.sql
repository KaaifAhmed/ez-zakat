-- Add total_zakat_due column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN total_zakat_due NUMERIC DEFAULT 0;

-- Create disbursements table
CREATE TABLE public.disbursements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount_paid NUMERIC NOT NULL,
  date_of_payment DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on disbursements table
ALTER TABLE public.disbursements ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for disbursements
CREATE POLICY "Users can view their own disbursements" 
ON public.disbursements 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own disbursements" 
ON public.disbursements 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own disbursements" 
ON public.disbursements 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own disbursements" 
ON public.disbursements 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates on disbursements
CREATE TRIGGER update_disbursements_updated_at
BEFORE UPDATE ON public.disbursements
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();