import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function Favoritos() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate(createPageUrl("Catalogo") + "?tab=favoritos", { replace: true });
  }, []);
  return null;
}