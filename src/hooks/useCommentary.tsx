import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import { useParams } from "react-router-dom";
import { getCommentaryByIncident, type CommentaryIncidents } from "../services/commentaryIncidentsService";

export function useCommentary() {
  const [commentary, setCommentary] = useState<CommentaryIncidents[]>([]);
  const [loadingCommentary, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const fetchIncident = async () => {
      try {
        const data = await getCommentaryByIncident(Number(id));
        setCommentary(data || []); 
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchIncident();

    // Suscripción realtime
    const channel = supabase
      .channel("comentarios-incidente-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "comentarios_incidente" },
        (payload) => {

          if (payload.eventType === "UPDATE") {
            setCommentary((prev) =>
              prev.map((c) =>
                c.id_comentario === payload.new.id_comentario
                  ? { ...c, ...payload.new }
                  : c
              )
            );
          }
          if (payload.eventType === "INSERT") {
            setCommentary((prev) => [...prev, payload.new as CommentaryIncidents]);
          }
          if (payload.eventType === "DELETE") {
            setCommentary((prev) =>
              prev.filter((c) => c.id_comentario !== payload.old.id_comentario)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  return { commentary, loadingCommentary };
}