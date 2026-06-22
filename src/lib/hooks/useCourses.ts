import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import type { Course } from "../../app/data";

type DbLesson = {
  id: string;
  title: string;
  duration: string;
  description: string;
  video_url: string;
  position: number;
};

type DbModule = {
  id: string;
  title: string;
  position: number;
  lessons: DbLesson[];
};

type DbCourse = {
  code: string;
  slug: string;
  title: string;
  level: string;
  hours: string;
  price: string;
  description: string;
  image_url: string | null;
  alt: string | null;
  topics: string[] | null;
  profesor_slug: string | null;
  published: boolean;
  modules: DbModule[];
};

function shapeCourse(row: DbCourse): Course {
  const sortedModules = [...row.modules].sort((a, b) => a.position - b.position);
  const modules = sortedModules.map((m) => ({
    id: m.id,
    title: m.title,
    lessons: [...m.lessons]
      .sort((a, b) => a.position - b.position)
      .map((l) => ({
        id: l.id,
        title: l.title,
        duration: l.duration,
        description: l.description,
        videoUrl: l.video_url,
      })),
  }));

  return {
    code: row.code,
    slug: row.slug,
    title: row.title,
    level: row.level,
    hours: row.hours,
    price: `€${Math.round(parseFloat(row.price))}`,
    description: row.description,
    image: row.image_url ?? "",
    alt: row.alt ?? "",
    topics: row.topics ?? [],
    profesorSlug: row.profesor_slug ?? "",
    published: row.published,
    lessons: modules.reduce((sum, m) => sum + m.lessons.length, 0),
    modules,
  };
}

const COURSE_SELECT = `
  code, slug, title, level, hours, price, description,
  image_url, alt, topics, profesor_slug, published,
  modules ( id, title, position, lessons ( id, title, duration, description, video_url, position ) )
`;

export function useCourses(onlyPublished = true) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let query = supabase.from("courses").select(COURSE_SELECT).order("code");
    if (onlyPublished) query = query.eq("published", true);

    query.then(({ data, error: err }) => {
      if (err) setError(err.message);
      else setCourses((data as DbCourse[] ?? []).map(shapeCourse));
      setLoading(false);
    });
  }, [onlyPublished]);

  return { courses, loading, error };
}

export function useCourse(slug: string | undefined) {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) { setLoading(false); return; }

    supabase
      .from("courses")
      .select(COURSE_SELECT)
      .eq("slug", slug)
      .single()
      .then(({ data, error: err }) => {
        if (err) setError(err.message);
        else setCourse(shapeCourse(data as DbCourse));
        setLoading(false);
      });
  }, [slug]);

  return { course, loading, error };
}
