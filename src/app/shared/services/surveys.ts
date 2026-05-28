import { Injectable,signal } from '@angular/core';
import { createClient } from '@supabase/supabase-js'

@Injectable({
  providedIn: 'root',
})
export class Surveys {
  supabase = createClient('https://xugobnvbgomjpqrwdchx.supabase.co', 'sb_publishable_fu-RXblBL1Xhe2xs73gFOQ_TSB9BU4q');
}
