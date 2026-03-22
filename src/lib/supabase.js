import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function createPlayer(sessionId, name, board) {
  const { data, error } = await supabase
    .from("players")
    .insert({
      session_id: sessionId,
      name,
      board: board.map((row) => row.map((sq) => sq.text)),
      marked: [],
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getPlayer(sessionId) {
  const { data, error } = await supabase
    .from("players")
    .select("*")
    .eq("session_id", sessionId)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return data;
}

export async function updateMarked(playerId, marked) {
  const { error } = await supabase
    .from("players")
    .update({ marked })
    .eq("id", playerId);

  if (error) throw error;
}

export async function uploadPhoto(sessionId, squareIndex, file) {
  const path = `${sessionId}/${squareIndex}.jpg`;

  const { error: uploadError } = await supabase.storage
    .from("bingo-photos")
    .upload(path, file, {
      contentType: "image/jpeg",
      upsert: true,
    });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from("bingo-photos")
    .getPublicUrl(path);

  return data.publicUrl;
}

export async function savePhoto(playerId, squareIndex, photoUrl, taskText) {
  const { error } = await supabase.from("photos").insert({
    player_id: playerId,
    square_index: squareIndex,
    photo_url: photoUrl,
    task_text: taskText,
  });

  if (error) throw error;
}

export async function claimWin(playerId, claimCode, winningLine) {
  const { data, error } = await supabase
    .from("wins")
    .insert({
      player_id: playerId,
      claim_code: claimCode,
      winning_line: winningLine,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getWin(playerId) {
  const { data, error } = await supabase
    .from("wins")
    .select("*")
    .eq("player_id", playerId)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return data;
}
