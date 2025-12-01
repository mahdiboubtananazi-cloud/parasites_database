import React, { useState, useMemo, useEffect } from "react";
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
  FormControlLabel,
  Checkbox,
  Divider,
  IconButton,
  useTheme,
  alpha,
  Drawer,
} from "@mui/material";
import { Search, Filter, X } from "lucide-react";
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

  const itemsPerPage = 12;
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const isRtl = i18n.language === "ar";

  useEffect(() => {
    const query = searchParams.get("search");
    if (query) setSearchTerm(query);
  }, [searchParams]);

  // Static options for filter sections
  const stageOptions = ["بيض", "يرقة", "طور متحوصل", "طور متحرك"];
  const sampleTypeOptions = ["براز", "دم", "بول", "مسحة", "جلد"];
  const stainColorOptions = ["بدون تلوين", "Lugol", "Ziehl Neelsen", "Giemsa"];

  // Derive dynamic filter options
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
            // Assuming dateAdded in ISO format: "YYYY-MM-DD"
            const d = new Date((p as any).dateAdded);
            return isNaN(d.getTime()) ? null : d.getFullYear().toString();
          })
          .filter(Boolean)
      )
    ).sort((a, b) => Number(b) - Number(a)); // newest first
  }, [parasites]);

  // Filtering logic including search term matching all relevant fields
  const filteredResults = useMemo(() => {
    if (!parasites) return [];
    const term = searchTerm.toLowerCase();
    return parasites.filter((p) => {
      if ((p as any).status === "pending") return false;

      // Search free text across specified fields and year (as string)
      const searchMatch =
        (p.scientificName || "").toLowerCase().includes(term) ||
        (p.arabicName || "").toLowerCase().includes(term) ||
        ((p as any).studentName || "").toLowerCase().includes(term) ||
((p as any).supervisorName || "").toLowerCase().includes(term) ||
        ((p as any).dateAdded?.slice(0, 4) || "").includes(term);

      if (!searchMatch) return false;

      // Type filters
      if (filters.types.length > 0 && !filters.types.includes(p.type || "")) return false;

      // Stage filter (assume stored in p.stage)
      if (filters.stages.length > 0 && !filters.stages.includes((p as any).stage || "")) return false;

      // Sample Type filter
      if (filters.sampleTypes.length > 0 && !filters.sampleTypes.includes((p as any).sampleType || "")) return false;

      // Stain Color filter
      if (filters.stainColors.length > 0 && !filters.stainColors.includes((p as any).stainColor || "")) return false;

      // Year filter
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

  // Handlers for toggling filters
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

  return (
    <Box sx={{ minHeight: "100vh", py: 4, bgcolor: "#F8F9FC" }}>
      <Container maxWidth="lg">
        <Stack spacing={3}>
          {/* Search field + Filter button */}
          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              fullWidth
              placeholder={t("search_placeholder") || "ابحث بالاسم العلمي، اسم الطالب، الأستاذ أو السنة"}
              size="medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={20} color="#9CA3AF" />
                  </InputAdornment>
                ),
              }}
              sx={{ bgcolor: "white", borderRadius: 2 }}
            />
            <Button
              variant="contained"
              startIcon={<Filter size={20} />}
              onClick={() => setFiltersOpen(true)}
              sx={{ whiteSpace: "nowrap" }}
            >
              {t("filters")}
            </Button>
          </Box>

          {/* Results count */}
          <Typography variant="subtitle1" color="text.secondary">
            {filteredResults.length} {t("results_found")}
          </Typography>
        </Stack>

        {/* Samples cards grid */}
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
              mt: 3,
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
                sx={{
                  cursor: "pointer",
                  borderRadius: 2,
                  overflow: "hidden",
                  boxShadow: 1,
                  ":hover": {
                    boxShadow: 6,
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="160"
                  image={fixImageUrl(sample.imageUrl)}
                  alt={sample.scientificName}
                />
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" noWrap>
                    {sample.scientificName}
                  </Typography>
                  {(sample as any).description && (
                    <Typography variant="body2" noWrap color="text.secondary" sx={{ mt: 0.5 }}>
                      {(sample as any).description}
                    </Typography>
                  )}
                  {(sample as any).dateAdded && (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                      {(sample as any).dateAdded}
                    </Typography>
                  )}
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
            />
          </Box>
        )}

        {/* Filters drawer */}
        <Drawer anchor="bottom" open={filtersOpen} onClose={() => setFiltersOpen(false)}>
          <Box sx={{ p: 3, maxHeight: "65vh", overflowY: "auto" }}>
            <Stack spacing={3}>
              {/* Close button */}
              <Box display="flex" justifyContent="flex-end">
                <IconButton size="small" onClick={() => setFiltersOpen(false)}>
                  <X size={20} />
                </IconButton>
              </Box>

              {/* Filter sections */}
              <Box>
                <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                  {t("parasite_type")}
                </Typography>
                <Stack spacing={1}>
                  {availableTypes.map((type) => (
                    <FormControlLabel
                      key={type}
                      control={
                        <Checkbox
                          checked={filters.types.includes(type)}
                          onChange={() => toggleFilter("types", type)}
                          size="small"
                        />
                      }
                      label={type}
                    />
                  ))}
                </Stack>
              </Box>

              <Divider />

              <Box>
                <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                  {t("parasite_stage")}
                </Typography>
                <Stack spacing={1}>
                  {["بيض", "يرقة", "طور متحوصل", "طور متحرك"].map((stage) => (
                    <FormControlLabel
                      key={stage}
                      control={
                        <Checkbox
                          checked={filters.stages.includes(stage)}
                          onChange={() => toggleFilter("stages", stage)}
                          size="small"
                        />
                      }
                      label={stage}
                    />
                  ))}
                </Stack>
              </Box>

              <Divider />

              <Box>
                <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                  {t("sample_type")}
                </Typography>
                <Stack spacing={1}>
                  {["براز", "دم", "بول", "مسحة", "جلد"].map((stype) => (
                    <FormControlLabel
                      key={stype}
                      control={
                        <Checkbox
                          checked={filters.sampleTypes.includes(stype)}
                          onChange={() => toggleFilter("sampleTypes", stype)}
                          size="small"
                        />
                      }
                      label={stype}
                    />
                  ))}
                </Stack>
              </Box>

              <Divider />

              <Box>
                <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                  {t("stain_color")}
                </Typography>
                <Stack spacing={1}>
                  {["بدون تلوين", "Lugol", "Ziehl Neelsen", "Giemsa"].map((color) => (
                    <FormControlLabel
                      key={color}
                      control={
                        <Checkbox
                          checked={filters.stainColors.includes(color)}
                          onChange={() => toggleFilter("stainColors", color)}
                          size="small"
                        />
                      }
                      label={color}
                    />
                  ))}
                </Stack>
              </Box>

              <Divider />

              <Box>
                <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                  {t("year_added")}
                </Typography>
                <Stack spacing={1}>
                  {availableYears.map((year) => (
                    <FormControlLabel
                      key={year}
                      control={
                        <Checkbox
                          checked={filters.years.includes(year)}
                          onChange={() => toggleFilter("years", year)}
                          size="small"
                        />
                      }
                      label={year}
                    />
                  ))}
                </Stack>
              </Box>

              <Divider />

              { (filters.types.length > 0 || filters.stages.length > 0 || filters.sampleTypes.length >0 || filters.stainColors.length >0 || filters.years.length > 0 || searchTerm) && (
                <Button
                  variant="outlined"
                  onClick={() => {
                    clearFilters()
                    setFiltersOpen(false)
                  }}
                  fullWidth
                >
                  {t("clear_all_filters")}
                </Button>
              )}
            </Stack>
          </Box>
        </Drawer>
      </Container>
    </Box>
  );
};

export default Archive;
