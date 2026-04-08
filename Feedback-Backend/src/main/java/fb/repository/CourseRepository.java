package fb.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import fb.model.Course;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
}
