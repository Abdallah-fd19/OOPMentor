using System;
using System.Collections.Generic;
using System.Text;

namespace OOPMentor.Application.Common
{

    public sealed class Result<T>
    {
        public bool Success { get; }
        public string Message { get; }
        public T? Data { get; }
        public IReadOnlyList<string>? Errors { get; }

        private Result(bool success, string message, T? data, IReadOnlyList<string>? errors)
        {
            Success = success;
            Message = message;
            Data = data;
            Errors = errors;
        }

        public static Result<T> Ok(T data, string message = "Operation completed successfully.") =>
            new Result<T>(success: true, message: message, data: data, errors: null);

        public static Result<T> Fail(string message, IEnumerable<string>? errors = null) =>
            new Result<T>(success: false, message: message, data: default, errors: errors?.ToList());
        
        public static Result<T> Fail(string message, string singleError) =>
            new Result<T>(success: false, message: message, data: default, errors: new List<string> { singleError });
    }

    public sealed class Result
    {
        public bool Success { get; }
        public string Message { get; }
        public IReadOnlyList<string>? Errors { get; }

        private Result(bool success, string message, IReadOnlyList<string>? errors)
        {
            Success = success;
            Message = message;
            Errors = errors;
        }

        public static Result Ok(string message = "Operation completed successfully.") =>
            new(success: true, message: message, errors: null);

        public static Result Fail(string message, IEnumerable<string>? errors = null) =>
            new(success: false, message: message, errors: errors?.ToList());
    }
}
