import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dgomsmsjurckqwrdnszs.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRnb21zbXNqdXJja3F3cmRuc3pzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyNzMyOTAsImV4cCI6MjA2Njg0OTI5MH0.oHJ2iqE231fudLJ2X5Qhq8Fq5C2EVgwIyVn72Cxjy6Q';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
