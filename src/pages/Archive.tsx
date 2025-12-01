import React, { useState, useMemo, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  TextField,
  InputAdornment,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Pagination,
  Paper,
  Stack,
  Chip,
  Divider,
  IconButton,
  useTheme,
  alpha,
  Collapse,
} from "@mui/material";
import { Search, Filter, X, Check } from "lucide-react";
import { useParasites } from "../hooks/useParasites";
import { useTranslation } from "react-i18next";

const fixImageUrl = (url?: string) => {
  if (!url) return "https://placehold.co/400x300?text=No+Image";
  if (url.includes("localhost")) {
    return url.replace(
      "localhost",
      window.location.hostname === "localhost" ? "localhost" : window.location.hostname
    );
  }
  return url;
};

interface Filters {
  types: string[];
  stages: string[];
  sampleTypes: string[];
  stainColors: string[];
  years: string[];
}

const Archive = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { parasites, loading } = useParasites();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    types: [],
    stages: [],
    sampleTypes: [],
    stainColors: [],
    years: [],
  });

  const filterRef = useRef<HTMLDivElement>(null);
  const itemsPerPage = 12;
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const isRtl = i18n.language === "ar";

  useEffect(() => {
    const query = searchParams.get("search");
    if (query) setSearchTerm(query);
  }, [searchParams]);

  const availableTypes = useMemo(() => {
    if (!parasites) return [];
    return Array.from(new Set(parasites.map((p) => p.type).filter(Boolean))).sort();
  }, [parasites]);

  const availableYears = useMemo(() => {
    if (!parasites) return [];
    return Array.from(
      new Set(
        parasites
          .map((p) => {
            const d = new Date((p as any).dateAdded);
            return isNaN(d.getTime()) ? null : d.getFullYear().toString();
          })
          .filter(Boolean)
      )
    ).sort((a, b) => Number(b) - Number(a));
  }, [parasites]);

  const filteredResults = useMemo(() => {
    if (!parasites) return [];
    const term = searchTerm.toLowerCase();
    return parasites.filter((p) => {
      if ((p as any).status === "pending") return false;

      const searchMatch =
        (p.scientificName || "").toLowerCase().includes(term) ||
        (p.arabicName || "").toLowerCase().includes(term) ||
        ((p as any).studentName || "").toLowerCase().includes(term) ||
        ((p as any).supervisorName || "").toLowerCase().includes(term) ||
        ((p as any).dateAdded?.slice(0, 4) || "").includes(term);

      if (!searchMatch) return false;

      if (filters.types.length > 0 && !filters.types.includes(p.type || "")) return false;
      if (filters.stages.length > 0 && !filters.stages.includes((p as any).stage || "")) return false;
      if (filters.sampleTypes.length > 0 && !filters.sampleTypes.includes((p as any).sampleType || "")) return false;
      if (filters.stainColors.length > 0 && !filters.stainColors.includes((p as any).stainColor || "")) return false;
      if (filters.years.length > 0) {
        const year = (p as any).dateAdded?.slice(0, 4);
        if (!year || !filters.years.includes(year)) return false;
      }

      return true;
    });
  }, [parasites, searchTerm, filters]);

  const totalPages = Math.ceil(filteredResults.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedResults = filteredResults.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters]);

  const toggleFilter = (category: keyof Filters, value: string) => {
    setFilters((prev) => {
      const currentArr = prev[category];
      return {
        ...prev,
        [category]: currentArr.includes(value)
          ? currentArr.filter((v) => v !== value)
          : [...currentArr, value],
      };
    });
  };

  const clearFilters = () => {
    setFilters({
      types: [],
      stages: [],
      sampleTypes: [],
      stainColors: [],
      years: [],
    });
    setSearchTerm("");
  };

  const FilterSection = ({ title, options, category }: { title: string, options: string[], category: keyof Filters }) => (
    <Box sx={{ mb: 3, flex: 1, minWidth: "250px" }}>
      <Typography variant="subtitle2" fontWeight="bold" color="text.primary" sx={{ mb: 1.5 }}>
        {title}
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {options.map((option) => {
          const isSelected = filters[category].includes(option);
          return (
            <Chip
              key={option}
              label={option}
              onClick={() => toggleFilter(category, option)}
              icon={isSelected ? <Check size={14} /> : undefined}
              sx={{
                bgcolor: isSelected ? alpha(theme.palette.primary.main, 0.1) : "white",
                color: isSelected ? theme.palette.primary.main : "text.primary",
                borderColor: isSelected ? theme.palette.primary.main : "divider",
                borderWidth: "1px",
                borderStyle: "solid",
                fontWeight: isSelected ? 600 : 400,
                "&:hover": {
                  bgcolor: isSelected ? alpha(theme.palette.primary.main, 0.2) : alpha(theme.palette.common.black, 0.05),
                },
              }}
            />
          );
        })}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ minHeight: "100vh", py: 4, bgcolor: "#F8F9FC" }}>
      <Container maxWidth="lg">
        <Stack spacing={3}>
          {/* Search & Filter Bar */}
          <Paper elevation={0} sx={{ p: 2, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
            <Stack spacing={2}>
              <Box sx={{ display: "flex", gap: 1 }}>
                <TextField
                  fullWidth
                  placeholder="ابحث بالاسم العلمي اسم الطالب الأستاذ أو السنة"
                  size="medium"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search size={20} color="#9CA3AF" />
                      </InputAdornment>
                    ),
                    disableUnderline: true,
                  }}
                  variant="standard"
                  sx={{ 
                    bgcolor: "transparent", 
                    "& .MuiInputBase-root": { fontSize: "1rem" } 
                  }}
                />
                <Button
                  variant={filtersOpen ? "contained" : "outlined"}
                  startIcon={filtersOpen ? <X size={20} /> : <Filter size={20} />}
                  onClick={() => setFiltersOpen(!filtersOpen)}
                  sx={{ 
                    whiteSpace: "nowrap", 
                    minWidth: "100px",
                    borderRadius: 2,
                    borderColor: "divider",
                    color: filtersOpen ? "white" : "text.primary",
                  }}
                >
                  {filtersOpen ? t("close") : t("filters")}
                </Button>
              </Box>

              {/* Collapsible Filter Panel */}
              <Collapse in={filtersOpen}>
                <Box sx={{ 
                  pt: 2, 
                  borderTop: "1px solid", 
                  borderColor: "divider",
                  mt: 1 
                }}>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                    <FilterSection 
                      title={t("parasite_type")} 
                      options={availableTypes} 
                      category="types" 
                    />
                    <FilterSection 
                      title={t("year_added")} 
                      options={availableYears} 
                      category="years" 
                    />
                    <FilterSection 
                      title={t("parasite_stage")} 
                      options={["بيض", "يرقة", "طور متحوصل", "طور متحرك"]} 
                      category="stages" 
                    />
                    <FilterSection 
                      title={t("stain_color")} 
                      options={["بدون تلوين", "Lugol", "Ziehl Neelsen", "Giemsa"]} 
                      category="stainColors" 
                    />
                    <FilterSection 
                      title={t("sample_type")} 
                      options={["براز", "دم", "بول", "مسحة", "جلد"]} 
                      category="sampleTypes" 
                    />
                  </Box>
                  
                  <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
                      <Button 
                        variant="text" 
                        color="error" 
                        onClick={clearFilters}
                        disabled={!searchTerm && Object.values(filters).every(arr => arr.length === 0)}
                      >
                        {t("clear_all_filters")}
                      </Button>
                  </Box>
                </Box>
              </Collapse>
            </Stack>
          </Paper>

          {/* Results count */}
          <Typography variant="body2" color="text.secondary" sx={{ px: 1 }}>
            {filteredResults.length} {t("results_found")}
          </Typography>

          {/* Results Grid */}
          {loading ? (
            <Box display="flex" justifyContent="center" py={8}>
              <CircularProgress />
            </Box>
          ) : filteredResults.length === 0 ? (
            <Typography variant="h6" align="center" mt={8} color="text.secondary">
              {t("no_results_found")}
            </Typography>
          ) : (
            <Box
              sx={{
                display: "grid",
                gap: 3,
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(3, 1fr)",
                },
              }}
            >
              {paginatedResults.map((sample) => (
                <Card
                  key={sample.id}
                  onClick={() => navigate(`/parasites/${sample.id}`)}
                  elevation={0}
                  sx={{
                    cursor: "pointer",
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    transition: "all 0.2s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 12px 24px rgba(0,0,0,0.05)",
                      borderColor: theme.palette.primary.main,
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="180"
                    image={fixImageUrl(sample.imageUrl)}
                    alt={sample.scientificName}
                  />
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom noWrap>
                      {sample.scientificName}
                    </Typography>
                    {(sample as any).description && (
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ 
                          mb: 1.5,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden"
                        }}
                      >
                        {(sample as any).description}
                      </Typography>
                    )}
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip 
                        label={(sample as any).dateAdded || "Unknown Date"} 
                        size="small" 
                        variant="outlined" 
                        sx={{ borderRadius: 1, fontSize: "0.7rem", height: 24 }}
                      />
                      {sample.type && (
                        <Chip 
                          label={sample.type} 
                          size="small" 
                          variant="filled"
                          sx={{ 
                            borderRadius: 1, 
                            fontSize: "0.7rem", 
                            height: 24,
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            color: theme.palette.primary.main
                          }} 
                        />
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}

          {/* Pagination */}
          {!loading && filteredResults.length > itemsPerPage && (
            <Box display="flex" justifyContent="center" mt={4}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(_, p) => setCurrentPage(p)}
                color="primary"
                shape="rounded"
              />
            </Box>
          )}
        </Stack>
      </Container>
    </Box>
  );
};

export default Archive;
