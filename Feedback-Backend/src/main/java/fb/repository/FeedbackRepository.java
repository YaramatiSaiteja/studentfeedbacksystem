package fb.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import fb.model.Feedback;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    List<Feedback> findByCourseId(Long courseId);
    List<Feedback> findByStudentId(String studentId);
    Feedback findByCourseIdAndStudentId(Long courseId, String studentId);
}
