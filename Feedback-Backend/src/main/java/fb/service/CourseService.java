package fb.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import fb.model.Course;
import fb.repository.CourseRepository;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    public Optional<Course> getCourseById(Long id) {
        return courseRepository.findById(id);
    }

    public Course createCourse(Course course) {
        if (course.getDepartment() != null) {
            course.setBranch(course.getDepartment());
        }
        return courseRepository.save(course);
    }

    public Course updateCourse(Long id, Course course) {
        return courseRepository.findById(id)
                .map(existing -> {
                    existing.setTitle(course.getTitle());
                    existing.setDescription(course.getDescription());
                    existing.setInstructor(course.getInstructor());
                    existing.setDepartment(course.getDepartment());
                    existing.setBranch(course.getDepartment() != null ? course.getDepartment() : course.getBranch());
                    return courseRepository.save(existing);
                })
                .orElseThrow(() -> new IllegalArgumentException("Course not found: " + id));
    }

    public void deleteCourse(Long id) {
        courseRepository.deleteById(id);
    }
}
