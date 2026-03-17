import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function Comparativo() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate(createPageUrl("Catalogo") + "?tab=comparativo", { replace: true });
  }, []);
  return null;
}